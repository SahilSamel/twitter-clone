import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { registerUser, checkHandle } from "./userController.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//<-- User Authentication -->

// Creating new User entry
const createUser = (req, res) => {
  const auth = getAuth();
  const { email, password, userHandle } = req.body;

  checkHandle(userHandle)                                                               //First check for duplicate userhandle
    .then(() => {
      return createUserWithEmailAndPassword(auth, email, password, userHandle);         //Make firebase entry
    })
    .then((userCredential) => {
      const user = userCredential.user;
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      const uid = user.uid;

      registerUser(uid, userHandle);                                                    //Make mongo and neo4j entry
      res.status(201).json({ token, uid });                                             //Pass auth token as response
    })
    .catch((error) => {
      res.status(409).json({ error: error.message });
    });
};

// Existing User Authentication
const signIn = (req, res) => {
  const auth = getAuth();
  const { email, password } = req.body;
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
//<-- End of User Authentication -->

export { createUser, signIn };
