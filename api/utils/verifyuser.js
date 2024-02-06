import jwt from "jsonwebtoken";
import errorHandler from "./error.js";

// !!!! Attention  Dont forget add .js after
//when you imported module from other js file

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));
  jwt.verify(token, process.env.JWT_SECRETE, (error, user) => {
    if (error) return next(errorHandler(401, "Foribidden"));
    req.user = user;
    next();
  });
};
