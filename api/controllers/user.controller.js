import errorHandler from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You only can change your account"));
  }
  const { currentPassword } = req.body.currentPassword;
  try {
    const vailedUser = await User.findOne(req.user.email);
    const vaildPassword = bcryptjs.compareSync(
      currentPassword,
      vailedUser.Password
    );
    if (!vaildPassword) {
      return next(errorHandler(401, "Your Password is Incorrect"));
    }
    req.body.newPassword = bcryptjs.hashSync(req.body.newPassword, 10);
    const updateUserPassword = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          password: req.body.newPassword,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUserPassword._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deletUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You only Delete your own Account!!!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(201).json("User has been Deleted!").clearCookie("access_token");
  } catch (error) {
    next(error);
  }
};
