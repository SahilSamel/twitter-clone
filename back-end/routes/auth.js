import express from "express";
import { createUser, signIn } from "../controller/authController.js";
import {
  fetchSignInMethodsForEmail,
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import verifyToken from "../middleware/verifyToken.js";

const auth = getAuth();
const router = express.Router();


router.post("/signup", (req, res) => {
  createUser(req, res);
});

router.post("/signin", (req, res) => {
  signIn(req, res);
});

export default router;
