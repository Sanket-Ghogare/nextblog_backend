//  authenticate.js

import jwt from 'jsonwebtoken';

const JWT_SECRET = "sjasfhuetheofujs";

const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];//separate the word "Bearer"  anIndex 1 gives us that token.
    if (!token ) {
        return res.status(401).json({ error: "Unauthorized: Token not provided" });
    }

    try {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {  //toekn , secect key and call back
            if (err) {
              return res.status(401).json({ error: 'Unauthorized: Invalid token' });
            }
            // If token is valid, attach user information to the request object
            req.user = decoded;//            // If token is valid, attach the decoded user information to the request object

            next();// This line passes control to the next middleware function
          });
        
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(403).json({ error: "Unauthorized: Invalid token", errorMessage: error.message });
    }
};

export default authenticateUser;