import mongoose from "mongoose";
import 'dotenv/config';

const mongo = async () => {
  try {
      mongoose.set('strictQuery', false);
      mongoose.connect(process.env.MongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,

    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

export default mongo;

