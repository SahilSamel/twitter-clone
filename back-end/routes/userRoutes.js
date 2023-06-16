import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  follow,
  unfollow,
  bookmark,
  unbookmark,
  getFollowingUserIds,
  refreshCache,
  scrolldownCache,
  updateCache
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

// <-- End of FOLLOW/UNFOLLOW FUNCTIONALITIES -->

// <-- BOOKMARKING FUNCTIONALITIES -->

//Create bookmark
router.post("/bookmark", verifyToken, (req, res) => {
  bookmark(req, res);
});

//Delete bookmark
router.post("/unbookmark", verifyToken, (req, res) => {
  unbookmark(req, res);
});

// <-- End of BOOKMARKING FUNCTIONALITIES -->

router.get("/getfollow", verifyToken, (req, res) => {
  getFollowingUserIds(req.userId.id,res);
});

router.post("/refresh", verifyToken, (req, res) => {
  updateCache(req, res, "refresh");
});

router.post("/scrolldown", verifyToken, (req, res) => {
  updateCache(req, res, "scrolldown");
});
export default router;
