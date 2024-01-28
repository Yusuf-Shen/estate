import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import { read } from "fs-extra";

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

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 12);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-6),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRETE);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export default signUp;
