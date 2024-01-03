import express from "express";

import { signUp } from "../controllers/auth.controller.js";

const signUpRouter = express.Router();

signUpRouter.post("/signUp", signUp);

export default signUpRouter;
