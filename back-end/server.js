import  path  from "path";
import  express from "express";
import mongoose from "mongoose";
import  application  from "express";
import mongo from "./connections/mongoDB.js"

const app = express();

//MongoDB Connection
mongo();

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