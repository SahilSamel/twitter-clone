import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createTweet, deleteTweet,bookmark, unbookmark, fetchTweet, createReply, deleteReply, likeTweet, dislikeTweet } from "../controller/tweetController.js";
const router = express.Router();

//<--- TWEET CREATION/DELETION FUNCTIONALITIES --->

//Create Tweet
router.post("/tweet", verifyToken, (req, res) => {
  createTweet(req, res);
});

//Delete Tweet
router.post("/delete", verifyToken, (req, res) => {
  deleteTweet(req, res);
});

//Fetch tweet
router.get("/getTweet", verifyToken, (req, res) => {
  fetchTweet(req, res);
});

//Create Reply Tweet
router.post("/reply", verifyToken, (req, res) => {
  createReply(req, res);
});

//Delete Reply Tweet
router.post("/deleteReply", verifyToken, (req, res) => {
  deleteReply(req, res);
});

//<--- End of TWEET CREATION FUNCTIONALITIES --->

// <-- BOOKMARKING FUNCTIONALITIES -->

//Create bookmark
router.post("/bookmark", verifyToken, (req, res) => {
  bookmark(req, res);
});

//Delete bookmark
router.post("/unbookmark", verifyToken, (req, res) => {
  unbookmark(req, res);
});

// <-- End of BOOKMARKING FUNCTIONALITIES -->

// <-- TWEET LIKE/DISLIKE FUNCTIONALITIES -->
router.post("/like", verifyToken, (req, res) => {
  likeTweet(req, res);
});

router.post("/dislike", verifyToken, (req, res) => {
  dislikeTweet(req, res);
});
// <-- End of TWEET LIKE/DISLIKE FUNCTIONALITIES -->

export default router;
