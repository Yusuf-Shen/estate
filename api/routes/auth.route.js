import express from "express";
import { signIn, signUp, google } from "../controllers/auth.controller.js";

const signUpRouter = express.Router();

signUpRouter.post("/signUp", signUp);
signUpRouter.post("/signIn", signIn);
signUpRouter.post("/google", google);

export default signUpRouter;
