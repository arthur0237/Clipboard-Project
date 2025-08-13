
// ************Entry point for the Application********************.

import * as dotenv from 'dotenv'
// Imports the dotenv package - A library that reads environment variables from a .env file
dotenv.config()
// Calls dotenv.config() - This loads all variables from your .env file into process.env

import express from "express";
import session from "express-session";

import passport from "passport";
;
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./Server/config/passport.js";
import aRoutes from "./Server/routes/auth.js"; 
import authMiddleware from "./Server/middleware/authMiddleware.js";
import authRoutes from "./Server/routes/authRoutes.js"; // Authenticated route or routes
import apiRoutes from "./Server/routes/api.js";


// const JWT_SECRET= process.env.JWT_SECRET;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('Server'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
 cookie: {
    secure: true, // change to true if using HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// ????
app.use(passport.initialize());
app.use(passport.session());

app.use(aRoutes); 

// app.use(authMiddleware); 
/* from this point whatever routes will be called,
 all will be the authenticated routes. 
Just the inclusion of the line app.use(authMiddleware); 
- makes all the upcoming routes authenticated. 
We need not to manually add the middleware to each of the route.*/ 

// app.use(authRoutes); 
/*implemented the '/show-email' ,
 just to check and debug the auth as well as middleware. */


app.use(apiRoutes);

// This is the main route  ????
app.get("/", (req, res) => {
  res.send(req.user ? `Hello ${req.user}` : "Not logged in");
});

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});