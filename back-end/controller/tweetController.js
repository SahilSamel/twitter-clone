// userId: { type: String, required: true },
// tweets: [
//   {
//     type: { type: Number, default: 0, enum: [0, 1, 2, 3] },
//     text: { type: String },
//     mediaURL: { type: String },
//     derivedUserId: { type: mongoose.Schema.Types.ObjectId },
//     derivedTweetId: { type: mongoose.Schema.Types.ObjectId },
//     threadId: { type: mongoose.Schema.Types.ObjectId },
//     timestamp: { type: Date, required: true },
//     likes: [
//       {
//         userId: { type: String },
//       },
//     ],
//   },
// ],

import Tweet from "../models/tweets.js";
const createTweet = (req, res) => {
  const userId = req.userId.id;
  const timestamp = new Date;
  const { type, text, mediaURL, derivedUserId, derivedTweetId,threadId} = req.body;
    console.log(userId)
  console.log(req.body)

  const newTweet = {
    type: 0,
    text: text || '',
    mediaURL: mediaURL || '',
    derivedUserId: derivedUserId || null,
    derivedTweetId: derivedTweetId || null,
    threadId: threadId || null,
    timestamp: new Date(),  
    likes: []
  };
  
  Tweet.findOneAndUpdate(
    { userId },
    { $push: { tweets: newTweet } },
    { new: true, upsert: true }
  )
    .then(updatedUser => {
      console.log('Updated user:', updatedUser);
    })
    .catch(error => {
      console.error('Error updating user:', error);
    });

};

export { createTweet };
