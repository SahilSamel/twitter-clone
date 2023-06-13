import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createTweet, deleteTweet, createReply, likeTweet, dislikeTweet } from "../controller/tweetController.js";
const router = express.Router();

//<--- TWEET CREATION FUNCTIONALITIES --->

//Create Tweet
router.post("/tweet", verifyToken, (req, res) => {
  createTweet(req, res);
});

//Delete Tweet
router.post("/delete", verifyToken, (req, res) => {
  deleteTweet(req, res);
});

//Create Reply Tweet
router.post("/reply", verifyToken, (req, res) => {
  createReply(req, res);
});

//<--- End of TWEET CREATION FUNCTIONALITIES --->


// <-- TWEET LIKE/DISLIKE FUNCTIONALITIES -->
router.post("/like", verifyToken, (req, res) => {
  likeTweet(req, res);
});

router.post("/dislike", verifyToken, (req, res) => {
  dislikeTweet(req, res);
});
// <-- End of TWEET LIKE/DISLIKE FUNCTIONALITIES -->

export default router;
