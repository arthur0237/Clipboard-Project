import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1]; // gets the token part after "Bearer"

  console.log("Token in authMiddleware:", token);

  if (!token) {
    console.log("Token does not exists");
    // User is not authenticated - It also mean that user had never visited the application ever in the past. 
    return res.sendStatus(401);
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
    return res.sendStatus(403);
  }
};

export default authMiddleware;  

// The res.json() method is used to send a JSON response. It takes a JavaScript object or array as an argument, serializes it into a JSON string, sets the Content-Type header to application/json, and then sends the response.

// The res.sendStatus() method is a convenience method that sets the HTTP status code and sends a corresponding string representation of that status code as the response body. It is equivalent to calling res.status(statusCode).send(statusText).