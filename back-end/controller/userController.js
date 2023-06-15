import User from "../models/users.js";
import driver from "../connections/neo4j.js";

// <-- SCROLL DOWN CACHE FUNCTION -->
const scrolldownupdate = (req, res) => {
  const userId = req.userId.id;
  const { lastTimestamp } = req.body;

  const followingUserIds = getFollowingUserIds(userId);

  Tweet.find({ userId: { $in: followingUserIds } })
    .sort({ "tweets.timestamp": -1 })
    .limit(50)
    .then((tweets) => {
      const filteredTweets = tweets.reduce((filtered, tweet) => {
        const filteredSubTweets = tweet.tweets.filter(
          (subTweet) => subTweet.timestamp < lastTimestamp
        );
        filtered.push(
          ...filteredSubTweets.map((subTweet) => ({
            userId: tweet.userId,
            tweetId: subTweet._id,
          }))
        );
        return filtered;
      }, []);

      const sortedTweets = filteredTweets.sort((a, b) => {
        const likesDiff = b.likes.length - a.likes.length;
        if (likesDiff !== 0) {
          return likesDiff;
        }
        return b.timestamp - a.timestamp;
      });

      const top50Tweets = sortedTweets.slice(0, 50);

      const scrolldownCache = top50Tweets.map((tweet) => ({
        userId: tweet.userId,
        tweetId: tweet.tweetId,
      }));

      User.findByIdAndUpdate(
        userId,
        { $set: { scrolldownCache: scrolldownCache } },
        { new: true }
      )
        .then((updatedUser) => {
          res.status(200).json({
            Message: "Scroll down cache updated successfully",
            User: updatedUser,
          });
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          res.status(500).json({ Error: "Failed to update scroll down cache" });
        });
    })
    .catch((error) => {
      console.error("Error retrieving tweets:", error);
      res.status(500).json({ Error: "Failed to retrieve tweets" });
    });
};

// <-- End of SCROLL DOWN CACHE FUNCTION -->

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

//Get Following
const getFollowingUserIds = (userId) => {
  const session = driver.session();

  const query = `
    MATCH (u:User)-[:FOLLOWS]->(followedUser:User)
    WHERE u.userId = $userId
    RETURN followedUser.userId AS followingUserId
  `;

  const params = { userId };

  return session
    .run(query, params)
    .then((result) => {
      const followingUserIds = result.records.map((record) =>
        record.get("followingUserId")
      );
      return followingUserIds;
    })
    .catch((error) => {
      console.error("Error retrieving following user ids:", error);
      throw error;
    })
    .finally(() => {
      session.close();
    });
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
export { scrolldownupdate, follow, unfollow, bookmark, unbookmark };
