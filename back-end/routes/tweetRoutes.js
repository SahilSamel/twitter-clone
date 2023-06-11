import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createTweet, deleteTweet, likeTweet, dislikeTweet, bookmark, unbookmark } from "../controller/tweetController.js";
const router = express.Router();

//<--- TwEET FUNCTIONS --->

router.post("/tweet", verifyToken, (req, res) => {
  createTweet(req, res);
});

router.post("/like", verifyToken, (req, res) => {
  likeTweet(req, res);
});

router.post("/dislike", verifyToken, (req, res) => {
  dislikeTweet(req, res);
});

router.post("/delete", verifyToken, (req, res) => {
  deleteTweet(req, res);
});

router.post("/bookmark", verifyToken, (req, res) => {
  bookmark(req, res);
}); 

router.post("/unbookmark", verifyToken, (req, res) => {
  unbookmark(req, res);
});

//<--- End of TwEET FUNCTIONS --->

export default router;