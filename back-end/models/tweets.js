import mongoose from "mongoose";

const tweetsSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, required: true },
    tweets: [
      {
        tweetId: { type: mongoose.Schema.Types.ObjectId },
        type: { type: Number, default: 0, enum: [0, 1, 2] }, 
        text: { type: String },
        mediaURL: { type: String },
        derivedUserId: { type: mongoose.Schema.Types.ObjectId },
        derivedTweetId: { type: mongoose.Schema.Types.ObjectId },
        threadId: { type: mongoose.Schema.Types.ObjectId },
        timestamp: { type: Date, required: true },
        likes: [
          {
            userId: { type: mongoose.Schema.Types.ObjectId },
          },
        ],
      },
    ],
});

const Tweets = mongoose.model("Tweet", tweetsSchema);

export default Tweets;
  