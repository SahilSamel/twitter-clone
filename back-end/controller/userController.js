import User from "../models/users.js"
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


const checkEmail = (email) => {
  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
    })
    .catch((error) => {
      throw new Error("Email already exists");
    });
}

const checkHandle = (userHandle) => {
  User.findOne({
    userHandle:userHandle
  }).then(
    (user) => {
        if(user){
          throw new Error("User Handle already exists");
        }
    }
  )
}

const registerUser = (uid) => {
    const newUser = new User({
        uid,
        userHandle
      });
    
    try {
        const savedUser = newUser.save();
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

export {registerUser, checkEmail, checkHandle};