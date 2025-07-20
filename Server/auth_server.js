// Now we are going to design the server.
// -->                Server Architecture 
        
// Flow :- Content of clipboard --> Main server --> AWS Cloud Storage  --- this is when we are pasting something to clipboard.
// Above flow becomes opposite when the user tries to copy something from the clipboard.

// Our initial plan was to have our own database that we will be managing using by the main server. ->>> But than we chnaged our mind and shifted to AWS Cloud Storage. 
// ->>> WHY?? 
// --->>> In order to reduce the latenncy between the responses of two different users. ---->>>> The server will be busy in managing only one user at a time and it will engaged with one user until the user is done with the clipboard operation.

// Few other reasons for shifting to AWS Cloud Storage are:- 
// 1. DEPLOYMENT -- DNS -- HOW ??? ---> 
// 2. SECURITY -- OF THE DATA -- HOW ??? --->
   
// ->>> If we talk about the storage that we need ->> we won't need a lot of storage becoz we are going to set the expiry time for the data from the AWS Cloud Storage. 

// ---->>>>> What was our initial plan to implement the server was that ->>>> We will have a main server and we will have some more number of servers which will be connected to the main server.
//    And than the main server will be distribute the request to all the servers (this is action is taken in order to reduce the load on the main server).  ----->>> Further the all the severs will be connected to the AWS Cloud Storage. Distribution of the requests by the main server to the all the servers will be done using loadbalancer. Loadbalancer will be impplemented by the main srever itself.

// But we didn't implemented in this way ->>>> Why ???? ->>>>   






// Tech Stack & Libraries
// Node.js   Express.js    Passport.js    passport-google-oauth20   dotenv  express-session


const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// In this part of code we are telling Passport - "Use the Google strategy for authentication"   ---> GoogleStrategy is provided by the passport-google-oauth20 library.

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },

// second parameter 
// This function is called after Google authenticates the user and sends back data.

  function(accessToken, refreshToken, profile, done) {
    // We need to have the values of parameter of this function if we wish to save all the details of user to our own database.
    return done(null, profile);  
    // done	--->> A callback function used by Passport to finish the login process
    // done() ->> tells the Passport that I have finished processing the user, and here is the user profile data.
    // null means no error occurred.
    // profile is passed into Passport and eventually becomes req.user.
  }
));


// These functions are required session handling functions that allow Passport to :-
// 1. Remember who is logged in 
// 2. Retrieve user information from the session when needed. 


// Now:-
// Think of serializeUser() as packing the user info into a suitcase (i.e., the session cookie).

// When the user successfully logs in, Passport calls this function.
// And user the user profile data that it wish to store in the session.

passport.serializeUser((user, done) => {
  done(null, user);
// we can also have :- 
// done(null, user.id); // Just save the user’s ID (lighter)
});

// Think of deserializeUser() as unpacking the user from the suitcase (i.e., retrieving from session cookie).
// For every new request (e.g., when hitting /profile), Passport calls this.
// It fetches the session data and attaches req.user so your routes can use it.

passport.deserializeUser((user, done) => {
  done(null, user);
});
    




