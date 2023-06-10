import express from "express";
const auth = getAuth();
const router = express.Router();

router.post("/tweet", (req, res) => {
    createTweet(req, res);                                                                     
});

export default router;