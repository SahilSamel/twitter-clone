import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createTweet, deleteTweet, likeTweet, dislikeTweet, bookmark, unbookmark } from "../controller/tweetController.js";
const router = express.Router();

//<--- TWEET CREATION FUNCTIONALITIES --->

router.post("/tweet", verifyToken, (req, res) => {
  createTweet(req, res);
});


router.post("/delete", verifyToken, (req, res) => {
  deleteTweet(req, res);
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
