import mongoose from "mongoose";

const tweetsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    tweets: [
      {
        type: { type: Number, default: 0, enum: [0, 1, 2] }, 
        text: { type: String },
        mediaURL: { type: String },
        derivedUserId: { type: mongoose.Schema.Types.ObjectId },
        derivedTweetId: { type: mongoose.Schema.Types.ObjectId },
        threadId: { type: mongoose.Schema.Types.ObjectId },
        timestamp: { type: Date, required: true },
        likes: [
          {
            userId: { type: String },
          },
        ],
      },
    ],
});

const Tweet = mongoose.model("Tweet", tweetsSchema);

export default Tweet;
