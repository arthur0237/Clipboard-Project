import { Router } from "express";
import passport from "passport";
import { registerQuery } from "../controllers/registerQuery.js";
import { googleAuth } from "../controllers/auth/_auth_google.js";
import { googleCallback } from "../controllers/auth/auth_google_callback.js"; 
import { pollAuth } from "../controllers/poll_auth.js";  


const router = Router();

// Middleware to skip the step of authentication each time the user uses the application.
// router.get("/middleware/auth",authMiddleware, (req, res) => {
//   res.redirect('/show-email');
// });

// 1. Register Query
router.post('/register-query', registerQuery);

// 2. Auth Start with queryId
// This endpoint initiates Google OAuth login using Passport.js
router.get('/auth/google', googleAuth);

// 3. OAuth Callback
router.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/' }), googleCallback);

// 4. Polling Endpoint
router.get('/poll-auth', pollAuth);


export default router;


