const router = express.Router();
import express from "express";
import { fetchTweet } from "../controller/tweetController.js";
import { getBookmarks } from "../controller/userController.js";

//Fetch tweet
router.get("/getTweet", (req, res) => {
    fetchTweet(req, res);
});

// //Fetch Refresh Cache
// router.get("/getRefreshCache", (req, res) => {
//     fetchTweet(req, res);
// });

// //Fetch Scroll Down Cache
// router.get("/getScrollDownCache", (req, res) => {
//     fetchTweet(req, res);
// });

//Fetch Bookmarks
router.get("/getBookmarks", verifyToken, (req, res) => {
    getBookmarks(req, res);
});

// //Fetch Liked Tweets
// router.get("/getLikes", (req, res) => {
//     fetchTweet(req, res);
// });

export default router;