import express from "express";
import { createUser, signIn } from "../controller/authController.js";
import {getAuth} from "firebase/auth";
import verifyToken from "../middleware/verifyToken.js";


const auth = getAuth();
const router = express.Router();

//<-- USER AUTHENTICATION -->

// Creating user in firebase, mongo and neo4j                                                     
router.post("/signup", (req, res) => {
  createUser(req, res);                                                                     
});

// Authenticating user with firebase function
router.post("/signin", (req, res) => {
  signIn(req, res);                                                             
});

//<--End of USER AUTHENTICATION -->



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


