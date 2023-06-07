import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, required: true },
  followersCount: { type: Number, default: 0 },
  followeesCount: { type: Number, default: 0 },
  feedCache: [
    {
      uid: { type: mongoose.Schema.Types.ObjectId, required: true },
      tweetid: { type: mongoose.Schema.Types.ObjectId, required: true }
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
      uid: { type: mongoose.Schema.Types.ObjectId, required: true },
      tweetid: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ],
  likes: [
    {
      uid: { type: mongoose.Schema.Types.ObjectId, required: true },
      tweetid: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ]
});

const User = mongoose.model("User", usersSchema);

export default User;
