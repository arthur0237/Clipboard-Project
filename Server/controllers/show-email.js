import jwt from "jsonwebtoken";
import redisClient from "../config/redisclient.js";

export async function showEmail(req, res){
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
}