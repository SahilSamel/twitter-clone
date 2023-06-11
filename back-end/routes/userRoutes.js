import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { bookmark, unbookmark } from "../controller/userController.js";
const router = express.Router();

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

export default router;
