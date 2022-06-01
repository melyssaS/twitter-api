import mongoose from 'mongoose';

import postRoutes from "./components/post/routes/post.routes";

import bodyParser from "body-parser";
import cors from 'cors';    
require('dotenv').config();

const express = require("express");
const app = express();


//Body Parser
server.app.use( bodyParser.urlencoded({ extended: true}));
server.app.use( bodyParser.json() );

//Server Routes
server.app.use(`/${process.env.NAME}/post`, postRoutes);

//CORS Config
server.app.use(cors({ origin: true, credentials: true }));

//Mongo
mongoose.connect(process.env.DATABASE_URL,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
        if (err) throw err;
        console.log('Database UP!')
    });

app.listen("8000",()=>{
    console.log("Server on port 8000")
} )