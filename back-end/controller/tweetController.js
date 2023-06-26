import Tweet from "../models/tweets.js";
import Thread from "../models/threads.js";
import User from "../models/users.js";

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
                $position: 0
              }
            },
            
            $set: { latestTweetTimestamp: new Date() } 
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
const fetchTweet = (req, res) => {
  const { userId, tweetId } = req.query;

  Tweet.findOne({ userId }, (err, userTweet) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!userTweet) {
      return res.status(404).json({ error: 'User Not there' });
    }

    const tweet = userTweet.tweets.id(tweetId); 
    
    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not in user' });
    }
    res.json(tweet);
  });
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

export {
  createTweet,
  deleteTweet,
  fetchTweet,
  createReply,
  deleteReply,
  likeTweet,
  dislikeTweet,
};
