
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
// import authMiddleware from "./Server/middleware/authMiddleware.js";
// import authRoutes from "./Server/routes/authRoutes.js"; // Authenticated route or routes
import apiRoutes from "./Server/routes/api.js";
import pollingRoutes from "./Server/routes/polling_api.js";

//**To run the html as well as server on the same port.
//** Don't forget to dig - that how it's getting done ??
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// To run the html as well as server on the same port. 
// code from line 31 to 36
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "Server/public_start")));

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

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
app.use(pollingRoutes);

// This is the main route  ????
app.get("/", (req, res) => {
  res.send(req.user ? `Hello ${req.user}` : "Not logged in");
});

// 🔹 Route to handle Google login from Android
app.post("/auth/google/2", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    // Exchange the auth code for Google tokens
    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "postmessage",
      grant_type: "authorization_code"
    });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const tokens = await tokenRes.json();
    if (!tokens.id_token) return res.status(400).json({ error: "No id_token" });

    // Decode id_token to get user info
    const base64Payload = tokens.id_token.split(".")[1];
    const payload = JSON.parse(Buffer.from(base64Payload, "base64").toString());
    const email = payload.email;

    console.log(`✅ Google verified: ${email}`);

    // Generate your app’s JWT
    const appToken = jwt.sign(
      { email, device: "android" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token: appToken, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});