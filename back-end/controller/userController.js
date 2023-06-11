import User from "../models/users.js";

// <-- BOOKMARKING FUNCTIONS -->

//Create a bookmark
const bookmark = (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  User.findOneAndUpdate(
    { uid: userId },
    { $push: { bookmarks: { userId: tweetUserId, tweetId } } }
  )
    .then(() => {
      res.status(200).json({ message: "Tweet bookmarked successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error while bookmarking tweet" });
    });
};

//Delete a bookmark
const unbookmark = (req, res) => {
  const userId = req.userId.id;
  const { tweetUserId, tweetId } = req.body;

  User.findOneAndUpdate(
    { uid: userId },
    { $pull: { bookmarks: { userId: tweetUserId, tweetId } } }
  )
    .then(() => {
      res.status(200).json({ message: "Tweet unbookmarked successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error while bookmarking tweet" });
    });
};

// <-- End of BOOKMARKING FUNCTIONS -->
export { bookmark, unbookmark };
