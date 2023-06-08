import express from "express";
import { createUser, signIn } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", (req, res) => {
  createUser(req, res);
});

export default router;
