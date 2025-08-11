
// ********Approach before MVC -- My Initial Approach************ 


require('dotenv').config();

const express = require('express');
const session = require('express-session');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// In this part of code we are telling Passport - "Use the Google strategy for authentication"   ---> GoogleStrategy is provided by the passport-google-oauth20 library.

const jwt = require('jsonwebtoken');
// ????
const bodyParser = require('body-parser');
// ????
const cors = require('cors');

const cookieParser = require('cookie-parser');

const redisClient = require('./redisclient');

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

// ????
app.use(passport.initialize());
app.use(passport.session());

// These functions are required for session handling, functions that allow Passport to :-
// 1. Remember who is logged in 
// 2. Retrieve user information from the session when needed. 

// Now:-
// Think of serializeUser() as packing the user info into a suitcase (i.e., the session cookie).

// When the user successfully logs in, Passport calls this function.
// And user the user profile data that it wish to store in the session.

passport.serializeUser((user, done) => done(null, user)
// we can also have :- 
// done(null, user.id); // Just save the user’s ID (lighter)
);

// Think of deserializeUser() as unpacking the user from the suitcase (i.e., retrieving from session cookie).
// For every new request (e.g., when hitting /profile), Passport calls this.
// It fetches the session data and attaches req.user so your routes can use it.
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
// second parameter 
// This function is called after Google authenticates the user and sends back data.

(accessToken, refreshToken, profile, done) => {
  // We need to have the values of parameter of this function if we wish to save all the details of user to our own database.
  done(null, profile);
  // done	--->> A callback function used by Passport to finish the login process
  // done() ->> tells the Passport that I have finished processing the user, and here is the user profile data.
  // null means no error occurred.
  // profile is passed into Passport and eventually becomes req.user.
}));


// 1. Register Query

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
  req.session.queryId = queryId;  // Store for later in callback
  console.log("Stored queryId in session:", req.session.queryId);
req.session.save(err => {
  if (err) {
      console.error('Failed to save session before redirect:', err);
      return res.status(500).send('Internal Server Error');
    }
  passport.authenticate('google', { 
    scope: ['email', 'profile'],
    state : queryId 
  })(req, res, next);
});
});



// 3. OAuth Callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    // const email = req.user.email;
    const email = req.user._json?.email;
      
    // just to debug 
    console.log("Session in callback:", req.session);

    // const queryId = req.session.queryId;
    const queryId = req.query.state; // Get queryId from state parameter

    if (!queryId) {
        return res.status(400).send('Query ID missing in session');
    }

    // Generate JWT token
    const token = jwt.sign({ email:email}, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store the same token in Redis
    await redisClient.set(queryId, token, { EX: 3600 });

    // Also update in-memory store used by the /poll-auth endpoint
    queryStore.set(queryId, { authenticated: true, token });

    // Set queryId in cookie to use later in /show-email
    res.cookie('query_id', queryId, { httpOnly: true });

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

// Try to access the token from Redis ????? 
// ***********What is the use of async and await here ?????***********

  const entry = queryStore.get(queryId);
//  ----> just to debug
  // console.log(entry);   

  // in conditional bracket whether the entry exist or not as well whether the user is authenticated or not is being checked.
  if (entry?.authenticated) {
    return res.json({"token": entry.token });
  }
  res.sendStatus(204); // not yet authenticated
});


// 5. Route to Decode and Display Email
app.get('/show-email', async (req, res) => {
  // http://localhost:5000/show-email?queryid=1234   
  const queryId = req.query.queryid;

  if (!queryId) return res.status(401).send('Query ID missing');

  const token = await redisClient.get(queryId);
  
  if (!token) return res.status(401).send('Token not found');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.send(`User Email: ${decoded.email}`);
  } catch (err) {
    res.status(403).send('Invalid or expired token');
  }
});



app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
