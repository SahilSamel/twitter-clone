import User from "../models/users.js";
import driver from "../connections/neo4j.js";
import Tweet from "../models/tweets.js";

// <-- FOLLOW/UNFOLLOW FUNCTIONS -->

//Follow
const follow = async (req, res) => {
  const followerUserId = req.userId.id;
  const { followeeUserId } = req.body;
  const session = driver.session(); // Assuming you have the Neo4j driver instance available

  try {
    // Create the follow relationship in Neo4j
    await session.run(
      "MATCH (follower:User {uid: $followerUserId}), (followee:User {uid: $followeeUserId}) " +
        "CREATE (follower)-[:FOLLOWS]->(followee)",
      { followerUserId, followeeUserId }
    );

    // Update follower's followeesCount in MongoDB
    await User.findOneAndUpdate(
      { uid: followerUserId },
      { $inc: { followeesCount: 1 } }
    );

    // Update followee's followersCount in MongoDB
    await User.findOneAndUpdate(
      { uid: followeeUserId },
      { $inc: { followersCount: 1 } }
    );

    session.close();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    session.close();
    res.status(500).json({ error: "Error updating follower's followeesCount" });
  }
};

//Unfollow
const unfollow = async (req, res) => {
  const followerUserId = req.userId.id;
  const { followeeUserId } = req.body;
  const session = driver.session(); // Assuming you have the Neo4j driver instance available

  try {
    // Delete the follow relationship in Neo4j
    await session.run(
      "MATCH (follower:User {uid: $followerUserId})-[f:FOLLOWS]->(followee:User {uid: $followeeUserId}) " +
        "DELETE f",
      { followerUserId, followeeUserId }
    );

    // Update follower's followeesCount in MongoDB
    await User.findOneAndUpdate(
      { uid: followerUserId },
      { $inc: { followeesCount: -1 } }
    );

    // Update followee's followersCount in MongoDB
    await User.findOneAndUpdate(
      { uid: followeeUserId },
      { $inc: { followersCount: -1 } }
    );

    session.close();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    session.close();
    res.status(500).json({ error: "Error updating follower's followeesCount" });
  }
};

//Get Following
const getFollowingUserIds = (userId) => {
  return new Promise((resolve, reject) => {
    const session = driver.session();

    const query = `
      MATCH (start:User)-[:FOLLOWS]->(end:User)
      WHERE start.uid = $userId
      RETURN end.uid AS followingUserId
    `;

    const params = { userId };

    session
      .run(query, params)
      .then((result) => {
        const followingUserIds = result.records.map((record) =>
          record.get("followingUserId")
        );
        resolve(followingUserIds);
      })
      .catch((error) => {
        console.error("Error retrieving following user IDs:", error);
        reject(error);
      })
      .finally(() => {
        session.close();
      });
  });
};

// <-- End of FOLLOW/UNFOLLOW FUNCTIONS -->

// <-- ACTIVITY NUMBER FUNCTIONS -->

const updateActivityNumberandTimer = async (userId, lastServedTimestamp) => {
  const MAX_ACTIVITY_NUMBER = 1.0; 
  const MIN_ACTIVITY_NUMBER = 0.0; 

  const currentTimestamp = Date.now();
  const timeDiffInHours =
    (currentTimestamp - lastServedTimestamp) / (1000 * 60 * 60);
  const recencyScore = Math.max(1 - timeDiffInHours / 24, 0);

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid: userId },
      { $set: { activityNum: (( + recencyScore) / 2) } },
      { new: true }
    ).exec();

    const activityNumber = updatedUser.activityNum;
    const maxTimerValue = 60000; 
    const minTimerValue = 20000; 

    let timer = maxTimerValue - activityNumber * (maxTimerValue - minTimerValue);

    timer = Math.max(timer, minTimerValue);

    return timer;
  } catch (error) {
    console.error(error);
  }
};

// <-- End of ACTIVITY NUMBER FUNCTIONS -->

// <-- BOOKMARKING FUNCTIONS -->

//Create a bookmark
const bookmark = (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  User.findOneAndUpdate(
    { uid: userId },
    { $push: { bookmarks: { userId: tweetUserId, tweetId } } }
  )
    .then(() => {
      res.status(200).json({ message: "Tweet bookmarked successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error while bookmarking tweet" });
    });
};

//Get Bookmarks
const getBookmarks = (req, res) => {
  const userId = req.userId.id;

  User.findOne({ uid: userId }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const bookmarks = user.bookmarks;
    return res.json({ bookmarks });
  });
};

//Delete a bookmark
const unbookmark = (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  User.findOneAndUpdate(
    { uid: userId },
    { $pull: { bookmarks: { userId: tweetUserId, tweetId } } }
  )
    .then(() => {
      res.status(200).json({ message: "Tweet unbookmarked successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error while bookmarking tweet" });
    });
};

// <-- End of BOOKMARKING FUNCTIONS -->

// <-- CACHE FUNCTIONS -->

const updateCache = (userId, lastTimestamp, cacheType, res) => {
  const timestamp = new Date(lastTimestamp);

  const filteredTweets = [];

  getFollowingUserIds(userId)
    .then((followingUserIds) => {
      Tweet.find({ userId: { $in: followingUserIds } })
        .then((tweets) => {
          tweets.map((tweets) => {
            tweets.tweets.map((item) => {
              const tweetTimestamp = new Date(item.timestamp);

              if (
                (cacheType === "scrolldown" && tweetTimestamp < timestamp) ||
                (cacheType === "refresh" && tweetTimestamp > timestamp)
              ) {
                filteredTweets.push({
                  userId: tweets.userId,
                  text: item.text,
                  tweetId: item._id,
                  timestamp: item.timestamp,
                });
              }
            });
          });

          filteredTweets.sort((a, b) => b.timestamp - a.timestamp);

          const sortedTweets = filteredTweets.slice(0, 50);

          const updateField =
            cacheType === "scrolldown" ? "scrolldownCache" : "refreshCache";

          User.findOneAndUpdate(
            { uid: userId },
            { $set: { [updateField]: sortedTweets } },
            { new: true }
          )
            .then((updatedUser) => {
              const message =
                cacheType === "scrolldown"
                  ? "ScrollDown cache updated successfully"
                  : "Refresh cache updated successfully";

            })
            .catch((error) => {
              const errorMessage =
                cacheType === "scrolldown"
                  ? "Failed to update ScrollDown cache"
                  : "Failed to update Refresh cache";
              console.log(error);
            });
          })
          .catch((error) => {
            
            console.log(error);
          });
        })
        .catch((error) => {
          
          console.log(error);
    });
};

const refreshEvent = async (req, res) => {
  const userId = req.userId.id;
  try {
    const user = await User.findOne({ uid: userId }).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let refreshCache = user.refreshCache;
    const { lastServedTimestamp } = req.body;

    if (refreshCache.length === 0) {
      // Update the refresh cache with a minimum timestamp
      const minTimestamp = 0; // Default minimum timestamp in JavaScript
      await updateCache(userId, minTimestamp, "refresh", res);

      // Fetch the updated refresh cache
      const updatedUser = await User.findOne({ uid: userId }).exec();
      refreshCache = updatedUser.refreshCache;

      if (refreshCache.length === 0) {
        // If the refresh cache is still empty, return "No new tweets"
        return res.json({ message: "No new tweets" });
      }
    }

    const latestCacheItem = refreshCache[refreshCache.length - 1];
    const tweet = await Tweet.findOne({
      userId: latestCacheItem.userId,
    }).exec();
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    const tweetObj = tweet.tweets.find(
      (t) => t._id.toString() === latestCacheItem.tweetId.toString()
    );
    if (!tweetObj) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    const bottomTweetTimestamp = tweetObj.timestamp;

    const timerValue = await updateActivityNumberandTimer(
      userId,
      lastServedTimestamp
    );
    await updateCache(userId, bottomTweetTimestamp, "scrolldown", res);


    return res.json({ refreshCache, timer: timerValue });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const scrollDownEvent = async (req, res) => {
  const userId = req.userId.id;
  try {
    const user = await User.findOne({ uid: userId }).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const scrollDownCache = user.scrolldownCache;
    if (scrollDownCache.length === 0) {
      // Return early if scrollDownCache is empty
      return res.json({ scrollDownCache: [], timer: 0 });
    }

    const { lastServedTimestamp } = req.body;
    const latestCacheItem = scrollDownCache[scrollDownCache.length - 1];
    const tweet = await Tweet.findOne({
      userId: latestCacheItem.userId,
    }).exec();
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    const tweetObj = tweet.tweets.find(
      (t) => t._id.toString() === latestCacheItem.tweetId.toString()
    );
    if (!tweetObj) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    const bottomTweetTimestamp = tweetObj.timestamp;

    const timerValue = await updateActivityNumberandTimer(
      userId,
      lastServedTimestamp
    );
    await updateCache(userId, bottomTweetTimestamp, "scrolldown", res);

    return res.json({ scrollDownCache, timer: timerValue });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Timer Event
const timeoutEvent = (req, res) => {
  const userId = req.userId.id;
  const { bottomTweetTimestamp } = req.body;
  updateCache(userId, bottomTweetTimestamp, "refresh", res); // Refresh Cache
};

// <-- End of CACHE FUNCTIONS -->

export {
  follow,
  unfollow,
  refreshEvent,
  scrollDownEvent,
  timeoutEvent,
  bookmark,
  getBookmarks,
  unbookmark,
  getFollowingUserIds,
};
