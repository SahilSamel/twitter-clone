import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { deleteUser, updateBio } from "../controller/profileController.js";
const router = express.Router();

//<--- PROFILE FUNCTIONALITIES --->

//Update bio
router.post("/updateBio", verifyToken, (req, res) => {
    updateBio(req, res);
});

//Delete the account
router.post("/deleteAccount", verifyToken, (req, res) => {
    deleteUser(req, res);
});

//<--- End of PROFILE FUNCTIONALITIES --->

export default router;