import express from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";

const signUpRouter = express.Router();

signUpRouter.post("/signUp", signUp);
signUpRouter.post("/signIn", signIn);

export default signUpRouter;
