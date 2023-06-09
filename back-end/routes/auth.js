import express from "express";
import { createUser, signIn } from "../controller/authController.js";
import {getAuth} from "firebase/auth";
import verifyToken from "../middleware/verifyToken.js";


const auth = getAuth();
const router = express.Router();


router.post("/signup", (req, res) => {
  createUser(req, res);
});

router.post("/signin", (req, res) => {
  signIn(req, res);
});


// <--- NODEMAILER SMTP  --->

// import nodemailer from "nodemailer"

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


