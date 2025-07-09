// your-project/
// ├── Server/
// │   ├── myauthpage.js         ← Main Express app
// │   └── auth_server.js      ← Google login strategy
// ├── .env                 ← Holds secret keys and URLs
// ├── package.json



// 1️⃣	User opens http://localhost:3000
// 2️⃣	Clicks “Login with Google” (goes to /auth/google)
// 3️⃣	Passport redirects to Google’s consent screen
// 4️⃣	User logs in & gives permission
// 5️⃣	Google sends user back to your app at /auth/google/callback
// 6️⃣	Passport handles the callback and creates session
// 7️⃣	User is redirected to /profile and sees their info
// 8️⃣	User can click Logout to clear session


// 🔐 How User Login Works Internally
// Passport stores the user info inside the session (cookie-based)

// Each time the user goes to /profile, Passport checks the session

// If the session exists, the user is authenticated

// Otherwise, it redirects to /


require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { Server } = require('http')
require('./auth_server'); // Import the authentication setup

const app = express();

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'consent select_account'
  })
);


app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  
  const { id, displayName, emails } = req.user;
  res.send(`
    <h1>User Profile</h1>
    <p><strong>ID:</strong> ${id}</p>
    <p><strong>Name:</strong> ${displayName}</p>
    <p><strong>Email:</strong> ${emails[0].value}</p>
    <a href="/logout">Logout</a>
  `);
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
