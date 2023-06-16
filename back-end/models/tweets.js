import mongoose from "mongoose";

const tweetsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    latestTweetTimestamp: { type: Date, required: true, default: null},
    tweets: [
      {
        type: { type: Number, default: 0, enum: [0, 1, 2, 3] }, 
        text: { type: String },
        mediaURL: { type: String },
        derivedUserId: { type:String },
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
