import express, { Router } from "express";
import {
  updatePassword,
  updateUser,
  deletUser,
  getUserListings,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.post("/update/:id", verifyToken, updateUser);
userRouter.post("/update/updatePassword", verifyToken, updatePassword);
userRouter.delete("/delete/:id", verifyToken, deletUser);
userRouter.get("/listings/:id", verifyToken, getUserListings);

export default userRouter;
