require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const session = require('cookie-session');

const jwt = require('jsonwebtoken');
// ????
const bodyParser = require('body-parser');
// ????
const cors = require('cors');

const cookieParser = require('cookie-parser');

// const { v4: uuidv4 } = require('uuid');

const redisClient = require('../redisclient');

const JWT_SECRET= process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(cookieParser());

// In-memory store (can be Redis/db in prod)
const queryStore = new Map();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
 cookie: {
    secure: true, // change to true if using HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: '26764968083-pfr6tbetve4kf13e6214pl15jslc49mf.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3003/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));


// 1. Register Query
// iss endpoint ke har ek line of code ko server execute karega na ????

app.post('/register-query', (req, res) => {
  const { queryId } = req.body; 
  //  In an Express.js server, req.body contains the data sent by the client (e.g., frontend, Python script) in the body of a POST request.

  if (!queryId) {
    return res.status(400).json({ error: 'Query ID is required' });
  }

  queryStore.set(queryId, { authenticated: false, token: null });
  // This line stores the queryId in an in-memory JavaScript Map called queryStore.

  res.sendStatus(200);
});


// 2. Auth Start with queryId
// This endpoint initiates Google OAuth login using Passport.js
app.get('/auth/google', (req, res, next) => {

  // Extracts the queryId from the query string of the request URL.
  const queryId = req.query.queryId;

  // To understand the next line :- 
// A session is data stored on the server, typically associated with a unique session ID.
// The session ID is often stored in a cookie on the client, so the server can retrieve the corresponding session data.
  res.cookie('query_id', queryId, { httpOnly: true });
  console.log(res.cookie);
  // req.session.queryId = queryId;  // Store for later in callback
  // console.log("Stored queryId in session:", req.session.queryId);
// req.session.save(err => {
//   if (err) {
//       console.error('Failed to save session before redirect:', err);
//       return res.status(500).send('Internal Server Error');
//     }
// });
    
  passport.authenticate('google', { 
    scope: ['email', 'profile'],
    state: queryId 
  })(req, res, next);
});



// 3. OAuth Callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const email = req.user._json?.email;
    const queryId = req.query.state;
    if (!queryId) {
        return res.status(400).send('Query ID missing in session');
    }

    // Generate JWT token
    const token = jwt.sign({ email:email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Store the same token in Redis
    console.log(token);
    await redisClient.set(queryId, token, { EX: 3600 });

    // Also update in-memory store used by the /poll-auth endpoint
    queryStore.set(queryId, { authenticated: true, token });

    // Set queryId in cookie to use later in /show-email
    // res.cookie('query_id', queryId, { httpOnly: true });

    // Redirect user to the result page
    res.redirect('/show-email');
  }
);



// 4. Polling Endpoint
app.get('/poll-auth', (req, res) => {

  // Extracting the queryId from the query string of request URL.
  const queryId = req.query.queryId;

 // Add validation
  if (!queryId) {
    return res.status(400).json({ error: 'Query ID is required' });
  }

  // entry holds the record (from queryStore) for a given queryId.
  // it will be something like - 
  // {
//   authenticated: true or false,
//   token: 'JWT_TOKEN_STRING'
//   }
  const entry = queryStore.get(queryId);

  // in conditional bracket whether the entry exist or not as well whether the user is authenticated or not is being checked.
  if (entry?.authenticated) {
    return res.status(200);
  }
  res.sendStatus(204); // not yet authenticated
});


// 5. Route to Decode and Display Email
app.get('/show-email', async (req, res) => {
  const queryId = req.query.queryid;
  if (!queryId) return res.status(401).send('Query ID missing');

  const token = await redisClient.get(queryId);
  console.log(token);
  if (!token) return res.status(401).send('Token not found');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.send(`User Email: ${decoded.email}`);
  } catch (err) {
    res.status(403).send('Invalid or expired token');
  }
});



app.listen(3003, () => console.log("✅ Server running on http://localhost:5000"));
