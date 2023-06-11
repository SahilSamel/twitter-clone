import Tweet from "../models/tweets.js";
import Thread from "../models/threads.js";
import User from "../models/users.js";

//  <--- TWEET FUNCTIONS --->

//  Create a new Tweet
const createTweet = (req, res) => {
  const userId = req.userId.id;
  const timestamp = new Date();
  const { type, text, mediaURL, derivedUserId, derivedTweetId, threadId } =
    req.body;

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
        { $push: { tweets: newTweet } },
        { new: true, upsert: true }
      )
        .then((updatedUser) => {
          res.status(201).json({ Message: updatedUser });
        })
        .catch((error) => {
          res.status(403).json({ Error: error });
        });
    })
    .catch((error) => {
      console.error("Error creating thread:", error);
    });
};

// Delete Tweet
const deleteTweet = (req, res) => {
  const { userId, objId } = req.body;

  Tweet.updateOne(
    { userId: userId, "tweets._id": objId },
    { $pull: { tweets: { _id: objId } } },
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        if (result.modifiedCount > 0) {
          res.status(201).json({ Message: "Tweet Deleted Successfully" });
        } else {
          res.status(201).json({ Message: "No tweet found" });
        }
      }
    }
  );
};

// Like tweet
const likeTweet = (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  Tweet.findOneAndUpdate(
    { userId: tweetUserId, "tweets._id": tweetId },
    { $push: { "tweets.$.likes": { userId: userId } } }
  )
    .then(() => {
      User.findOneAndUpdate(
        { uid: userId },
        { $push: { liked: { userId: tweetUserId, tweetId } } }
      )
        .then(() => {
          res.status(200).json({ message: "Tweet liked successfully" });
        })
        .catch((error) => {
          res.status(500).json({ error: "Error updating user liked array" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Dislike tweet
const dislikeTweet = (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  Tweet.findOneAndUpdate(
    { userId: tweetUserId, "tweets._id": tweetId },
    { $pull: { "tweets.$.likes": { userId: userId } } }
  )
    .then(() => {
      User.findOneAndUpdate(
        { uid: userId },
        { $pull: { liked: { userId: tweetUserId, tweetId } } }
      )
        .then(() => {
          res.status(200).json({ message: "Tweet unliked successfully" });
        })
        .catch((error) => {
          res.status(500).json({ error: "Error updating user liked array" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

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

//  <--- End of TWEET FUNCTIONS --->

export {
  createTweet,
  deleteTweet,
  likeTweet,
  dislikeTweet,
  bookmark,
  unbookmark,
};
