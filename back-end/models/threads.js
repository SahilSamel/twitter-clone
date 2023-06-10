import mongoose from "mongoose";

const threadsSchema = new mongoose.Schema({
    replies:[{
        userId:{type:String},
        tweetId:{type:mongoose.Schema.Types.ObjectId},
        threadId:{type:mongoose.Schema.Types.ObjectId}
    }]
});

const Thread = mongoose.model("Thread", threadsSchema);

export default Thread;
