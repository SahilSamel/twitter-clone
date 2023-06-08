//Main import
import  path  from "path";
import  express from "express";
import mongoose from "mongoose";
import  application  from "express";
import helmet from 'helmet';

//Connections import
import mongo from "./connections/mongoDB.js"
import driver from "./connections/neo4j.js";
import fapp from "./connections/firebaseconfig.js";
const app = express();

//Route Imports
import authRoutes from './routes/auth.js';


//MongoDB connection
mongo();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());

//Routes
app.use("/auth", authRoutes);


//Connection to port
const PORT = process.env.PORT || 6969;
app.listen
(
    PORT,
    (err) =>{
        if(err)
            throw err;
        console.log(`Server started on PORT ${PORT}...`);
    }
);