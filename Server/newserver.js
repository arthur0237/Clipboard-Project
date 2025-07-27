require('dotenv').config();

const express = require('express');
const session = require('express-session');


const jwt = require('jsonwebtoken');
// ????
const bodyParser = require('body-parser');
// ????
const cors = require('cors');

const cookieParser = require('cookie-parser');

const redisClient = require('../redisclient');
const authRouter = require("./routes/auth");

const JWT_SECRET= process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(cookieParser());
app.use(authRouter);

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








app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
