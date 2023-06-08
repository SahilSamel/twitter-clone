import express from "express";
import { createUser, signIn } from "../controller/authController.js";
import {
  fetchSignInMethodsForEmail,
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";


const auth = getAuth();

import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/signup", (req, res) => {
  createUser(req, res);
});

router.post("/signin", (req, res) => {
  signIn(req, res);
});

router.post("/check", (req, res) => {
  fetchSignInMethodsForEmail(auth,"sahilsamel134@gmail.com").then((result) => {
    console.log(result);
  })
  .catch((error)=>{
    console.log(error)
  });

  res.status(201).json({ body: req.body });
});

export default router;
