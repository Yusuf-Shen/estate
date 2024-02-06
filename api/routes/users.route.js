import express, { Router } from "express";
import { updatePassword, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.post("/update/:id", verifyToken, updateUser);
userRouter.post("/update/updatePassword", verifyToken, updatePassword);

export default userRouter;
