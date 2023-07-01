import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  userName: { type: String },
  userHandle: { type: String, required: true },
  followersCount: { type: Number, default: 0 },
  followeesCount: { type: Number, default: 0 },
  joinDate: { type: Date },
  refreshCache: [
    {
      userId: { type: String, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
  ],
  scrolldownCache: [
    {
      userId: { type: String, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
  ],
  activityNum: { type: Number, default: 0 },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  birthdate: { type: Date, default: null },
  profileImageURL: { type: String, default: "" },
  bgImageURL: { type: String, default: "" },
  bookmarks: [
    {
      userId: { type: String, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
  ],
  liked: [
    {
      userId: { type: String, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
  ],
});

const User = mongoose.model("User", usersSchema);

export default User;
