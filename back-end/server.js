import express from "express";
import helmet from 'helmet';
import bodyParser from "body-parser";
import cors from "cors";

// <-- Connections import -->
import mongo from "./connections/mongoDB.js";
import driver from "./connections/neo4j.js";
import fapp from "./connections/firebaseconfig.js";
const app = express();
// <-- End of Connections import -->

// <-- Route Imports -->
import getRoutes from './routes/getRoutes.js'
import authRoutes from './routes/authRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import userRoutes from './routes/userRoutes.js';
// <-- End of Route Imports -->

// MongoDB connection
mongo();


// <-- Middleware -->
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// <-- End of Middleware -->

// <-- Routes -->
app.use('/', getRoutes);
app.use("/auth", authRoutes);
app.use("/compose", tweetRoutes);
app.use("/profile", profileRoutes);
app.use("/user", userRoutes);
// <-- End of Routes -->


// Connection to port
const PORT = process.env.PORT || 6969;
app.listen(PORT, (err) => {
  if (err)
    throw err;
  console.log(`Server started on PORT ${PORT}...`);
});