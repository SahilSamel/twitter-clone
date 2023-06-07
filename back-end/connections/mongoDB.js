import mongoose from "mongoose";

const db = "mongodb+srv://twitterclone420:<password>@twitter-clone.cou0rwh.mongodb.net/Twitter_Clone?retryWrites=true&w=majority";

const mongo = async () => {
  try {
    await mongoose.connect(db);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongo;