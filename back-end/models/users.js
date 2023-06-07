import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  followersCount: { type: Number, default: 0 },
  followeesCount: { type: Number, default: 0 },
  feedCache: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ],
  activityNum: { type: Number, default: 0 },
  bio: { type: String },
  location: { type: String },
  birthdate: { type: Date, required: true },
  profileImageURL: { type: String },
  bgImageURL: { type: String },
  bookmarks: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ],
  liked: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ]
});

const User = mongoose.model("User", usersSchema);

export default User;

