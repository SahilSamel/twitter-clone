import mongoose from "mongoose";

const threadsSchema = new mongoose.Schema({
    replies:[{
        userId:{type:String},
        tweetId:{type:String},
        threadId:{type:String}
    }]
});

const Thread = mongoose.model("Thread", threadsSchema);

export default Thread;
