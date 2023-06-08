import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import {registerUser} from "./userController.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const createUser = (req,res) => {
  const auth = getAuth();
  const {email, password} = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      const uid = user.uid;
      registerUser(uid);
      res.status(201).json({ token, uid });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

const signIn = (req,res) => {
  const auth = getAuth();
  const {email, password} = req.body;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      const uid = user.uid;
      res.status(201).json({ token, uid });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

export { createUser, signIn };
