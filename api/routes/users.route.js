import express, { Router } from "express";
import {
  updatePassword,
  updateUser,
  deletUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.post("/update/:id", verifyToken, updateUser);
userRouter.post("/update/updatePassword", verifyToken, updatePassword);
userRouter.delete("/delete/:id", verifyToken, deletUser);

export default userRouter;
