/*export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;
    if(!token) return next(errorHandler(401,'Unauthorized'));
    jwt.verify(token, process.env.JWT_SECRET, (err,user) =>{
        if(err) return next(errorHandler(403, 'Forbiddedn'));
        req.user = user;
        next();

    });

};*/
/*export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token; //|| req.headers.authorization?.split(" ")[1];
    console.log("Token received in verifyToken:", token);
    if (!token) return next(errorHandler(401, 'Unauthorized'));
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(403, 'Forbidden'));
      console.log("Decoded user:", user);
      req.user = user;
      next();
    });
  };*/
import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';
  export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
    console.log("Token received in verifyToken:", token);
    if (!token) return next(errorHandler(401, 'Unauthorized'));
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(403, 'Forbidden'));
      console.log("Decoded user:", user);
      req.user = user;
      next();
    });
  };
  
  
//new
export const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json('Authentication required');
        }

        // Check if the user role matches one of the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json('Access denied: Insufficient permissions');
        }

        next();
    };
};

