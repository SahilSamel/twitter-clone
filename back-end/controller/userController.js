import User from "../models/users.js";
import driver from "../connections/neo4j.js";


// <-- SCROLL DOWN CACHE FUNCTION -->
const scrolldownupdate = (req,res) => {
  const userId = req.userId.id;
  const {lastTimestamp} = req.body;
}
// <-- End of SCROLL DOWN CACHE FUNCTION -->

// <-- FOLLOW/UNFOLLO FUNCTIONS -->

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

// <-- End of FOLLOW/UNFOLLO FUNCTIONS -->

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
export { follow, unfollow, bookmark, unbookmark };
