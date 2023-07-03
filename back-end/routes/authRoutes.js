import express from "express";
import { checkLogin, createUser, signIn } from "../controller/authController.js";
import {getAuth} from "firebase/auth";

const auth = getAuth();
const router = express.Router();

//<-- USER AUTHENTICATION FUNCTIONALITIES -->

// Check if user already logged in
router.get("/checkLogin", (req, res) => {
  checkLogin(req, res);
});

// Log User Out
router.get("/clearAuth", (req, res) => {
  try {
    res.clearCookie('token');
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cookies" });
  }
});


// Creating user in firebase, mongo and neo4j                                                     
router.post("/signup", (req, res) => {
  createUser(req, res);                                                                     
});

// Authenticating user with firebase function
router.post("/signin", (req, res) => {
  signIn(req, res);                                                             
});

//<--End of USER AUTHENTICATION FUNCTIONALITIES -->



// <--- NODEMAILER SMTP --->
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.email,
//     pass: process.env.password,
//   },
// });

// const mailOptions = {
//   from: process.env.email,
//   to: 'aaryan3120@gmail.com',
//   subject: 'Test Email',
//   text: 'This is a test email sent using Nodemailer and Gmail SMTP.',
// };

// router.post("/email", (req, res) => {


//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending email:', error);
//       res.status(201).json({"E":error})

//     } else {  
//       console.log('Email sent:', info.response);
//     }
//   });

//   });

// <--- End of NODEMAILER SMTP --->


export default router;


