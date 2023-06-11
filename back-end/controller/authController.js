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

dotenv.config();

//<-- USER AUTHENTICATION FUNCTIONS -->

//Database Queries for Authentication
const checkHandle = (userHandle) => {
  return User.findOne({ userHandle: userHandle }).then((user) => {
    if (user) {
      throw new Error("User Handle already exists");
    }
  });
};

//Database Entry for User
const registerUser = (uid, userHandle) => {
  const newUser = new User({
    uid,
    userHandle,
  });
  const session = driver.session(); //neo4j session creation

  session
    .run("CREATE (:User {uid: $uid})", { uid }) // Create query for Neo4j Cypher
    .then((neo4jResult) => {
      newUser
      .save()
      .then(() => {
        console.log("User saved successfully.");
      })
      .catch((error) => {
        console.log("Error saving user:", error);
      });

    })
    .catch((error) => {
      console.log("Error creating node:", error);
    })
    .finally(() => {
      session.close(); // Close the Neo4j session
    });
};

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

//<-- End of USER AUTHENTICATION FUNCTIONS -->

export { createUser, signIn };
