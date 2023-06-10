import Tweet from "../models/tweets.js";
const createTweet = (req, res) => {
  const userId = req.userId;
  const { type, text, mediaURL, derivedUserId, derivedTweetId } = req.body;

  console.log(new Date());

  Tweet.findOne({
    userId: userId,
  }).then((user) => {
    if (user) {
      const filter = { userId: "user123" }; 
      const update = { userId: "newUserId" }; 

      Tweet.findOneAndUpdate(filter, update, { new: true })
        .then((updatedEntry) => {

          console.log("Updated entry:", updatedEntry);
        })
        .catch((error) => {

          console.error("Error updating entry:", error);
        });
    } else {
      Tweet.create({
        userId,
      })
        .then((newUserEntry) => {
          console.log("New user entry saved:", newUserEntry);
        })
        .catch((error) => {
          console.error("Error saving user entry:", error);
        });
    }
  });

  // userId: { type: String, required: true },
  // tweets: [
  //   {
  //     type: { type: Number, default: 0, enum: [0, 1, 2, 3] },
  //     text: { type: String },
  //     mediaURL: { type: String },
  //     derivedUserId: { type: mongoose.Schema.Types.ObjectId },
  //     derivedTweetId: { type: mongoose.Schema.Types.ObjectId },
  //     threadId: { type: mongoose.Schema.Types.ObjectId },
  //     timestamp: { type: Date, required: true },
  //     likes: [
  //       {
  //         userId: { type: String },
  //       },
  //     ],
  //   },
  // ],
};

export { createTweet };
