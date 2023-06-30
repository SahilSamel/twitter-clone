import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  getProfile,
  selfTweets,
  selfReplies,
  selfLiked,
  deleteUser,
  UpdateProfileData,
  getUserId
} from "../controller/profileController.js";
const router = express.Router();

// <-- USER DATA RETRIEVAL FUNCTIONALITIES -->

//Get all user profile information
router.get("/getProfile", (req, res) => {
  getProfile(req, res);
});

// <-- End of USER DATA RETRIEVAL FUNCTIONALITIES -->

// <-- SELF TWEET RETRIEVAL FUNCTIONALITIES -->

//Get self tweets
router.get("/getTweets", (req, res) => {
  selfTweets(req, res);
});

//Get self replies
router.get("/getReplies", (req, res) => {
  selfReplies(req, res);
});

//Get self liked tweets
router.get("/getLiked", (req, res) => {
  selfLiked(req, res);
});

// <-- End of SELF TWEET RETRIEVAL FUNCTIONALITIES -->

//<--- PROFILE UPDATE FUNCTIONALITIES --->

router.post("/updateProfile", verifyToken, (req, res) => {
  UpdateProfileData(req, res);
});

//<--- End of PROFILE UPDATE FUNCTIONALITIES --->

// <-- DELETE USER FUNCTIONALITY -->

//Delete the account
router.post("/deleteAccount", verifyToken, (req, res) => {
  deleteUser(req, res);
});

// <-- End of DELETE USER FUNCTIONALITY -->

router.post("/getUserID",verifyToken,(req,res)=>{
    getUserId(req,res);
})

export default router;
