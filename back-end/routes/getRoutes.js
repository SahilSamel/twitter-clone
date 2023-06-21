const router = express.Router();
import express from "express";
import { fetchTweet } from "../controller/tweetController.js";

//Fetch tweet
router.get("/getTweet", (req, res) => {
    fetchTweet(req, res);
});
export default router;