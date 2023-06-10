import path from "path";
import express from "express";
import mongoose from "mongoose";
import application from "express";
import helmet from 'helmet';
import bodyParser from "body-parser";

// <-- Connections import -->
import mongo from "./connections/mongoDB.js";
import driver from "./connections/neo4j.js";
import fapp from "./connections/firebaseconfig.js";
const app = express();
// <-- End of Connections import -->

// <-- Route Imports -->
import authRoutes from './routes/auth.js';
import tweetRoutes from './routes/tweet.js';
// <-- End of Route Imports -->

// MongoDB connection
mongo();


// <-- Middleware -->
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// <-- End of Middleware -->

// <-- Routes -->
app.use("/auth", authRoutes);
app.use("/compose", tweetRoutes);
// <-- End of Routes -->


// Connection to port
const PORT = process.env.PORT || 6969;
app.listen(PORT, (err) => {
  if (err)
    throw err;
  console.log(`Server started on PORT ${PORT}...`);
});