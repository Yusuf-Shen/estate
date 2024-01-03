import express, { Router } from "express";
import test from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/test", test);

export default userRouter;
