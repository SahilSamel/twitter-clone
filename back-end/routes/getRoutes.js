const router = express.Router();
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { fetchTweet } from "../controller/tweetController.js";
import {getBookmarks } from "../controller/userController.js";

//Fetch tweet
router.get("/getTweet", verifyToken, (req, res) => {
    fetchTweet(req, res);
});

//Fetch Bookmarks
router.get("/getBookmarks", verifyToken, (req, res) => {
    getBookmarks(req, res);
});

// //Fetch Liked Tweets
// router.get("/getLikes", (req, res) => {
//     fetchTweet(req, res);
// });

export default router;