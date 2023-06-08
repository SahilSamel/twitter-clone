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

import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to your service account JSON file
const serviceAccountPath = path.join(__dirname, 'sa.json');

// Read the service account JSON file
const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');

// Parse the service account JSON data
const serviceAccount = JSON.parse(serviceAccountData);

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



router.post("/check", (req, res) => {
  const email = "sahilsamel13@gmail.com";

  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
      console.log(userRecord.email);
      res.status(200).json({ exists: true });
    })
    .catch((error) => {
      console.log(error);
      res.status(200).json({ exists: false });
    });
});

  

export default router;
