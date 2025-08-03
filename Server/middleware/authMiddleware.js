import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
const authHeader = req.headers['authorization'];
console.log(authHeader);
const token = authHeader && authHeader.split(' ')[1]; // gets the token part after "Bearer"

  console.log("Token in authMiddleware:", token);

  if (!token) {
    // User is not authenticated - It also mean that user had never visited the application ever in the past. 
    return res.send(404);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user data if needed
    next(); // allow route access
  } catch (err) {
    // Invalid token
    return res.send(404);
  }
};
