import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 12);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User Created Successfully!");
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body; // !!! this is object not array so make it sure use {} destructing object
  try {
    const vaildUser = await User.findOne({ email });
    if (!vaildUser) return next(errorHandler(404, "User Not Found!"));
    const vaildPassword = bcryptjs.compareSync(password, vaildUser.password);
    if (!vaildPassword) return next(errorHandler(404, "Invaild Password!"));
    const token = jwt.sign({ id: vaildUser._id }, process.env.JWT_SECRETE); // create token (cookie) for checking user authentic.
    const { password: pass, ...rest } = vaildUser._doc; // add _doc remove the password
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(201)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export default signUp;
