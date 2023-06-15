import Tweet from "../models/tweets.js";
import Thread from "../models/threads.js";
import User from "../models/users.js";
import mongoose from "mongoose";

//  <--- TWEET CREATION FUNCTIONS --->

//  Create a new Tweet
const createTweet = (req, res) => {
  return new Promise((resolve, reject) => {
    const userId = req.userId.id;
    const timestamp = new Date();
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
          { $push: { tweets: newTweet } },
          { new: true, upsert: true }
        )
          .then((updatedUser) => {
            resolve({
              replytweetId:
                updatedUser.tweets[updatedUser.tweets.length - 1]._id,
              replythreadId: threadId,
            });
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

// const checkType = (req) =>{
//       const {type,derivedTweetId,derivedUserId} = req.body;

//       switch (type) {
//         case 2:
//           Tweet.findOne(
//             { "tweets.userId": derivedUserId, "tweets._id": derivedTweetId },
//             { "tweets.$": 1 }
//           )
//             .then((tweet) => {
//               if (tweet && tweet.tweets.length > 0) {
//                 const threadId = tweet.tweets[0].threadId;
//                 console.log(threadId)
//                 console.log("ThreadId:", threadId);
//               } else {
//                 console.log("Tweet not found");
//               }
//             })
//             .catch((error) => {
//               console.log("Error:", error);
//             });

//           break;

//         default:
//           break;
//       }
// }

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

// <-- LIKE/DISLIKE FUNCTIONS -->

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

// <-- End of LIKE/DISLIKE FUNCTIONS -->

export { createTweet, deleteTweet, createReply, deleteReply, likeTweet, dislikeTweet };
