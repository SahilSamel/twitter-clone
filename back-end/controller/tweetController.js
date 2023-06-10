import Tweet from "../models/tweets.js";
import Thread from "../models/threads.js";

//  <--- TWEET FUNCTIONS --->

//  Create a new Tweet
const createTweet = (req, res) => {
  const userId = req.userId.id;
  const timestamp = new Date();
  const { type, text, mediaURL, derivedUserId, derivedTweetId, threadId } =
    req.body;
    
  const newThread = new Thread({ replies: [] });

  newThread.save()
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
          console.log("Updated user:", updatedUser);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
      
    })
    .catch((error) => {
    console.error('Error creating thread:', error);
    });


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
          console.log("Updated user:", updatedUser);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
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
          res.status(201).json({ "Message": "Tweet Deleted Successfully" });
        } else {
          res.status(201).json({ "Message": "No tweet found" });
        }
      }
    }
  );
};
//  <--- End of TWEET FUNCTIONS --->

export { createTweet, deleteTweet };
