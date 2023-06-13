import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { deleteUser, updateBio, updateLocation, updateBirthdate } from "../controller/profileController.js";
const router = express.Router();

//<--- PROFILE UPDATE FUNCTIONALITIES --->

//Update bio
router.post("/updateBio", verifyToken, (req, res) => {
    updateBio(req, res);
});

//Update Location
router.post("/updateLocation", verifyToken, (req, res) => {
    updateLocation(req, res);
});

//Update Birth Date
router.post("/updateBirthdate", verifyToken, (req, res) => {
    updateBirthdate(req, res);
});

//<--- End of PROFILE UPDATE FUNCTIONALITIES --->

// <-- DELETE USER FUNCTIONALITY -->

//Delete the account
router.post("/deleteAccount", verifyToken, (req, res) => {
    deleteUser(req, res);
});

// <-- End of DELETE USER FUNCTIONALITY -->

export default router;