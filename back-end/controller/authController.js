import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import driver from "../connections/neo4j.js";
import User from "../models/users.js";

const session = driver.session(); //neo4j session creation



dotenv.config();

//<-- USER AUTHENTICATION -->

//Database Queries for Authentication 
const checkHandle = (userHandle) => {
  return User.findOne({ userHandle: userHandle }).then((user) => {
    if (user) {
      throw new Error("User Handle already exists");
    }
  });
};
//

//Database Entry for User 
const registerUser = (uid, userHandle) => {
  const newUser = new User({
    uid,
    userHandle,
  });

  try {
    const result = session.run(
      "CREATE (:User {uid: $uid})", //Create query for neo4j cypher
      { uid }
    );
    newUser.save();
    session.close(); //Query to create user in mongo using mongoose
  } catch (error) {
    throw new Error("Error registering user");
    session.close(); //Query to create user in mongo using mongoose
  }
};
//

// Creating new User entry
const createUser = (req, res) => {
  const auth = getAuth();
  const { email, password, userHandle } = req.body;

  checkHandle(userHandle) //First check for duplicate userhandle
    .then(() => {
      return createUserWithEmailAndPassword(auth, email, password, userHandle); //Make firebase entry
    })
    .then((userCredential) => {
      const user = userCredential.user;
      const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
      const uid = user.uid;

      registerUser(uid, userHandle); //Make mongo and neo4j entry
      res.status(201).json({ token, uid }); //Pass auth token as response
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
