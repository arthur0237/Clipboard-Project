import jwt from "jsonwebtoken";
import { queryStore }from "../../services/storage.js";
import redisClient from "../../config/redisclient.js";

  export async function googleCallback(req, res){

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