import { Router } from "express";
import { registerQuery } from "../controllers/registerQuery";

const router = Router();

// 1. Register Query
// iss endpoint ke har ek line of code ko server execute karega na ????

// In-memory store (can be Redis/db in prod)
const queryStore = new Map();

router.post('/register-query', registerQuery);


// 2. Auth Start with queryId
// This endpoint initiates Google OAuth login using Passport.js
router.get('/auth/google', (req, res, next) => {

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
router.get('/auth/google/callback',
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
router.get('/poll-auth', (req, res) => {

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

// to be used for testing

// 5. Route to Decode and Display Email
router.get('/show-email', async (req, res) => {
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


module.export = router;