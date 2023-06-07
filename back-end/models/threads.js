import mongoose from "mongoose";

const threadsSchema = new mongoose.schema({
    replies:[{
        userId:{type:mongoose.Schema.Types.ObjectId},
        tweetId:{type:mongoose.Schema.Types.ObjectId},
        threadId:[{
            threadId:{type:mongoose.Schema.Types.ObjectId}
        }]
    }]
});