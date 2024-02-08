import express from "express";
import {
  signIn,
  signUp,
  google,
  signOut,
} from "../controllers/auth.controller.js";

const signUpRouter = express.Router();

signUpRouter.post("/signUp", signUp);
signUpRouter.post("/signIn", signIn);
signUpRouter.post("/google", google);
signUpRouter.get("/signOut", signOut); // Attention get : retrive Data.

export default signUpRouter;
