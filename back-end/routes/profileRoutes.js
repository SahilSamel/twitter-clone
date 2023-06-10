import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { deleteUser } from "../controller/profileController.js";
const router = express.Router();

//<--- PROFILE FUNCTIONALITIES --->

router.post("/deleteAccount", verifyToken, (req, res) => {
    deleteUser(req, res);
});

//<--- End of PROFILE FUNCTIONALITIES --->

export default router;