import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  follow,
  unfollow,
  checkIfFollows,
  refreshEvent,
  scrollDownEvent,
  timeoutEvent,
  getBookmarks,
} from "../controller/userController.js";
const router = express.Router();

// <-- FOLLOW/UNFOLLOW FUNCTIONALITIES -->

//Follow
router.post("/follow", verifyToken, (req, res) => {
  follow(req, res);
});

//Unfollow
router.post("/unfollow", verifyToken, (req, res) => {
  unfollow(req, res);
});

//Check if one user follows another user
router.post("/checkFollows", verifyToken, (req, res) => {
  checkIfFollows(req, res);
})

// <-- End of FOLLOW/UNFOLLOW FUNCTIONALITIES -->

// <-- BOOKMARKING FUNCTIONALITIES -->

// Get bookmarks
router.post("/getBookmarks", verifyToken, (req, res) => {
  getBookmarks(req, res);
});

// <-- End of BOOKMARKING FUNCTIONALITIES -->

// <-- CACHING FUNCTIONALITIES -->

//Refresh Event
router.post("/refresh", verifyToken, (req, res) => {
  refreshEvent(req, res, "refresh");
});

//Scroll Down Event
router.post("/scrolldown", verifyToken, (req, res) => {
  scrollDownEvent(req, res, "scrolldown");
});

//Timeout Event
router.post("/timeout", verifyToken, (req, res) => {
  timeoutEvent(req, res);
});

// <-- End of CACHING FUNCTIONALITIES -->
export default router;
