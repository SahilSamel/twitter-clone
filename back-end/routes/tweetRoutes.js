import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createTweet } from "../controller/tweetController.js";
const router = express.Router();

//<--- TwEET FUNCTIONS --->


router.post("/tweet", verifyToken, (req, res) => {
    createTweet(req, res);
  });


//<--- End of TwEET FUNCTIONS --->


export default router;