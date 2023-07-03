import Tweet from "../models/tweets.js";
import Thread from "../models/threads.js";
import User from "../models/users.js";
import driver from "../connections/neo4j.js";

//  <--- TWEET CREATION FUNCTIONS --->

//  Create a new Tweet
const createTweet = (req, res) => {
  return new Promise((resolve, reject) => {
    const userId = req.userId.id;
    const { type, text, mediaURL, derivedUserId, derivedTweetId } = req.body;
    const newThread = new Thread({ replies: [] });

    newThread
      .save()
      .then((savedThread) => {
        const threadId = savedThread._id;

        const newTweet = {
          type: parseInt(type),
          text: text || "",
          mediaURL: mediaURL || "",
          derivedUserId: derivedUserId || null,
          derivedTweetId: derivedTweetId || null,
          threadId: threadId || null,
          timestamp: new Date(),
          likes: [],
        };

        Tweet.findOneAndUpdate(
          { userId },
          {
            $push: {
              tweets: {
                $each: [newTweet],
                $position: 0,
              },
            },

            $set: { latestTweetTimestamp: new Date() },
          },
          { new: true, upsert: true }
        )
          .then((updatedUser) => {
            resolve(
              {
                replytweetId:
                  updatedUser.tweets[updatedUser.tweets.length - 1]._id,
                replythreadId: threadId,
              },
              res.status(201).json({ Message: "Tweet Created" })
            );
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Delete Tweet
const deleteTweet = (req, res) => {
  const userId = req.userId.id;
  const { objId } = req.body;

  Tweet.updateOne(
    { userId: userId, "tweets._id": objId },
    { $set: { "tweets.$.text": "" } },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ Error: "Failed to delete tweet" });
      } else {
        if (result.nModified > 0) {
          res.status(201).json({ Message: "Tweet text cleared successfully" });
        } else {
          res.status(404).json({ Message: "Tweet not found" });
        }
      }
    }
  );
};

//Fetch tweet
const fetchTweet = async (req, res) => {
  const { userId, tweetUserId, tweetId } = req.query;

  const session = driver.session();
  try {
    const userTweet = await Tweet.findOne({ userId: tweetUserId });

    if (!userTweet) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const user = await User.findOne({ uid: tweetUserId });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const tweet = userTweet.tweets.id(tweetId);

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    const {
      type,
      text,
      mediaURL,
      derivedUserId,
      derivedTweetId,
      threadId,
      timestamp,
      likes,
    } = tweet;
    const { userHandle, userName } = user;

    const result = await session.run(
      `
      MATCH (:User)-[r:BOOKMARKED]->(t:Tweet {tweetId: $tweetId})
      RETURN count(r) AS bookmarkCount
      `,
      { tweetId }
    );
    const bookmarkCount = parseInt(
      result.records[0]?.get("bookmarkCount") || 0
    );

    const likedByResult = await session.run(
      `
      MATCH (u:User {uid: $userId})-[:LIKES]->(t:Tweet {tweetId: $tweetId})
      RETURN COUNT(*) AS likeCount
      `,
      { userId, tweetId }
    );
    const likedByCount = likedByResult.records[0].get("likeCount").toNumber();

    const bookmarkedByResult = await session.run(
      `
      MATCH (u:User {uid: $userId})-[:BOOKMARKED]->(t:Tweet {tweetId: $tweetId})
      RETURN COUNT(*) AS bookmarkCount
      `,
      { userId, tweetId }
    );
    const bookmarkedByCount = bookmarkedByResult.records[0]
      .get("bookmarkCount")
      .toNumber();

    const likedBy = likedByCount > 0;
    const bookmarkedBy = bookmarkedByCount > 0;

    let repliesCount = 0;
    const thread = await Thread.findById(threadId);

    if (thread) {
      repliesCount = thread.replies.length;
    }

    const tweetData = {
      type,
      text,
      mediaURL,
      derivedUserId,
      derivedTweetId,
      threadId,
      timestamp,
      likes: likes.length,
      bookmarks: bookmarkCount,
      replies: repliesCount,
      likedBy: likedByCount,
      bookmarkedBy: bookmarkedByCount,
      userHandle,
      userName,
    };
    res.json(tweetData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    session.close();
  }
};

//Create reply
const createReply = (req, res) => {
  const replyUserId = req.userId.id;
  const { type, text, mediaURL, derivedUserId, derivedTweetId, tweetThreadId } =
    req.body;

  try {
    createTweet(req, res)
      .then(({ replytweetId, replythreadId }) => {
        const newReply = {
          userId: replyUserId,
          tweetId: replytweetId,
          threadId: replythreadId,
        };

        Thread.findByIdAndUpdate(
          tweetThreadId,
          { $push: { replies: newReply } },
          { new: true }
        )
          .then((updatedThread) => {
            res.status(201).json({ Message: updatedThread });
          })
          .catch((error) => {
            console.error("Error updating thread:", error);
            res.status(500).json({ Error: "Failed to update thread" });
          });
      })
      .catch((error) => {
        console.error("Error creating tweet:", error);
      });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(403).json({ Error: error });
  }
};

// Fetch replies
const fetchReplies = (req, res) => {
  const { threadId } = req.query;
  
  // Assuming you're using MongoDB and Mongoose
  Thread.findById(threadId)
    .then((thread) => {
      if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
      }
      const replies = thread.replies;
      res.json({ replies });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch replies" });
    });
};


//Delete Reply
const deleteReply = (req, res) => {
  const userId = req.userId.id;
  const { tweetId } = req.body;

  Tweet.findOneAndUpdate(
    { userId, "tweets._id": tweetId },
    {
      $set: {
        "tweets.$.text": null,
        "tweets.$.likes": [],
      },
    }
  )
    .then((result) => {
      if (result) {
        res.status(201).json({ Message: "Reply deleted successfully" });
      } else {
        res.status(404).json({ Message: "Reply not found" });
      }
    })
    .catch((error) => {
      console.error("Error deleting reply:", error);
      res.status(500).json({ Error: "Failed to delete reply" });
    });
};

//  <--- End of TWEET CREATION FUNCTIONS --->

// <-- BOOKMARK FUNCTIONS -->

//Create a bookmark
const bookmark = async (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MERGE (t:Tweet {tweetId: $tweetId})
      RETURN t
      `,
      { tweetId }
    );

    const query = `
      MATCH (u:User {uid: $userId})
      MATCH (t:Tweet {tweetId: $tweetId})
      MERGE (u)-[:BOOKMARKED]->(t)
    `;

    await session.run(query, { userId, tweetId });

    await User.findOneAndUpdate(
      { uid: userId },
      {
        $push: {
          bookmarks: {
            userId: tweetUserId,
            tweetId: tweetId,
          },
        },
      }
    );

    res.status(200).json({ message: "Tweet bookmarked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error while bookmarking tweet" });
  } finally {
    session.close();
  }
};

//Delete a bookmark
const unbookmark = async (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  const session = driver.session();

  try {
    const query = `
      MATCH (u:User {uid: $userId})-[r:BOOKMARKED]->(t:Tweet {tweetId: $tweetId})
      DELETE r
    `;

    await session.run(query, { userId, tweetId });

    const result = await session.run(
      `
      OPTIONAL MATCH (t:Tweet {tweetId: $tweetId})<-[r:BOOKMARKED]-()
      WITH t, COUNT(r) AS bookmarkCount
      WHERE bookmarkCount = 0
      DELETE t
      RETURN t
      `,
      { tweetId }
    );

    await User.findOneAndUpdate(
      { uid: userId },
      { $pull: { bookmarks: { userId: tweetUserId, tweetId } } }
    );

    res.status(200).json({ message: "Tweet unbookmarked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error while unbookmarking tweet" });
  } finally {
    session.close();
  }
};

// <-- End of BOOKMARK FUNCTIONS -->

// <-- LIKE/DISLIKE FUNCTIONS -->

// Like tweet
const likeTweet = async (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MERGE (t:Tweet {tweetId: $tweetId})
      RETURN t
      `,
      { tweetId }
    );

    const query = `
      MATCH (u:User {uid: $userId})
      MATCH (t:Tweet {tweetId: $tweetId})
      MERGE (u)-[:LIKES]->(t)
    `;

    await session.run(query, { userId, tweetId });

    await Promise.all([
      Tweet.findOneAndUpdate(
        { userId: tweetUserId, "tweets._id": tweetId },
        { $push: { "tweets.$.likes": { userId: userId } } }
      ),
      User.findOneAndUpdate(
        { uid: userId },
        { $push: { liked: { userId: tweetUserId, tweetId } } }
      ),
    ]);

    res.status(200).json({ message: "Tweet liked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    session.close();
  }
};

// Dislike tweet
const dislikeTweet = async (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  const session = driver.session();

  try {
    const query = `
      MATCH (u:User {uid: $userId})-[r:LIKES]->(t:Tweet {tweetId: $tweetId})
      DELETE r
    `;

    await session.run(query, { userId, tweetId });

    const result = await session.run(
      `
      OPTIONAL MATCH (t:Tweet {tweetId: $tweetId})<-[r:LIKES]-()
      WITH t, COUNT(r) AS likesCount
      WHERE likesCount = 0
      DELETE t
      RETURN t
      `,
      { tweetId }
    );

    await Promise.all([
      Tweet.findOneAndUpdate(
        { userId: tweetUserId, "tweets._id": tweetId },
        { $pull: { "tweets.$.likes": { userId: userId } } }
      ),
      User.findOneAndUpdate(
        { uid: userId },
        { $pull: { liked: { userId: tweetUserId, tweetId } } }
      ),
    ]);

    res.status(200).json({ message: "Tweet unliked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    session.close();
  }
};

// <-- End of LIKE/DISLIKE FUNCTIONS -->

export {
  createTweet,
  deleteTweet,
  bookmark,
  unbookmark,
  fetchTweet,
  createReply,
  fetchReplies,
  deleteReply,
  likeTweet,
  dislikeTweet,
};
