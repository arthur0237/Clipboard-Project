import jwt from "jsonwebtoken";
import redisClient from "../config/redisclient.js";

export async function showEmail(req, res){
  console.log(req.user)
    res.send({
      email: `${req.user.email}`
    });
}