import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  uid:{type:String, required:true},
  followersCount: { type: Number, default: 0 },
  followeesCount: { type: Number, default: 0 },
  feedCache: [
    {
      userId: { type: String, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ],
  activityNum: { type: Number, default: 0 },
  bio: { type: String },
  location: { type: String },
  birthdate: { type: Date},
  profileImageURL: { type: String },
  bgImageURL: { type: String },
  bookmarks: [
    {
      userId: { type: String, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ],
  liked: [
    {
      userId: { type: String, required: true },
      tweetId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ]
});

const User = mongoose.model("User", usersSchema);

export default User;

