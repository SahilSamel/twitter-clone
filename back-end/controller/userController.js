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


// <-- UPDATE CACHE FUNCTION -->

const updateCache = (req, res, cacheType) => {
  const userId = req.userId.id;
  const { lastTimestamp } = req.body;

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
          console.log(sortedTweets);

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

              res.status(200).json({
                Message: message,
                User: updatedUser,
              });
            })
            .catch((error) => {
              console.error("Error updating user:", error);
              const errorMessage =
                cacheType === "scrolldown"
                  ? "Failed to update ScrollDown cache"
                  : "Failed to update Refresh cache";

              res.status(500).json({ Error: errorMessage });
            });
        })
        .catch((error) => {
          console.error("Error retrieving tweets:", error);
          res.status(500).json({ Error: "Failed to retrieve tweets" });
        });
    })
    .catch((error) => {
      console.error("Error retrieving following user IDs:", error);
      res.status(500).json({ Error: "Failed to retrieve following user IDs" });
    });
};

// <-- End of UPDATE CACHE FUNCTION -->


export {
  follow,
  unfollow,
  bookmark,
  unbookmark,
  getFollowingUserIds,
  updateCache,
};
