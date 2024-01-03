import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signUp = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 12);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  res.status(201).json("User Created Successfully!");
};

export default signUp;
