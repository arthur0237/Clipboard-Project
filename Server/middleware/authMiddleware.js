import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1]; // gets the token part after "Bearer"

  console.log("Token in authMiddleware:", token);

  if (!token) {
    console.log("Token does not exists");
    // User is not authenticated - It also mean that user had never visited the application ever in the past. 
    return res.sendStatus(401).json({ error: 'Authentication required' });
  }
  console.log("Hello");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user data if needed
    console.log("ashutosh");
    next(); // allow route access
  } catch (err) {
    console.log("Decoding error");
    // Invalid token
    // this below line code sendStatus sends and then we are again trying to send 
    // header with chained json which implicitly sends response again
    // and sending response twice is not allowed
    // res.sendStatus(403).json({error: "Invalid or expired token"});
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;  