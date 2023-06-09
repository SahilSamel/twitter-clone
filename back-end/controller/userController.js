import User from "../models/users.js"
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import neo4j from 'neo4j-driver';
import driver from '../connections/neo4j.js'

//neo4j session creation

const session = driver.session();


// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccountPath = path.join(__dirname, 'sa.json');
// Read the service account JSON file
const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
// Parse the service account JSON data
const serviceAccount = JSON.parse(serviceAccountData);
// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const checkHandle = (userHandle) => {
  return User.findOne({ userHandle: userHandle }).then((user) => {
    if (user) {
      throw new Error("User Handle already exists");
    }
  });
};

const registerUser = (uid, userHandle) => {
  const newUser = new User({
    uid,
    userHandle
  });

  try {
    const result = session.run(
      'CREATE (:User {uid: $uid})',
      {uid}
    );
    newUser.save();
  } catch (error) {
    throw new Error("Error registering user");
  } finally{
    session.close();
  }
};

export {registerUser, checkHandle};