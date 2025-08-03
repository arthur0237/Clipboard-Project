 import passport from "passport";
 import { Strategy as GoogleStrategy } from "passport-google-oauth20";
 import dotenv from "dotenv";
 dotenv.config();
 

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
   callbackURL: 'http://localhost:5000/auth/google/callback'
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
 