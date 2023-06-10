import express from "express";
// const auth = getAuth();
import verifyToken from "../middleware/verifyToken.js";
import { createTweet } from "../controller/tweetController.js";
const router = express.Router();

router.post("/tweet", verifyToken, (req, res) => {
    createTweet(req, res);
  });



export default router;