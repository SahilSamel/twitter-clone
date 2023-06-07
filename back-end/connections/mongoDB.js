import mongoose from "mongoose";
import 'dotenv/config'

const mongo = async () => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MongoDB);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.log(error);
  }
};

export default mongo;
