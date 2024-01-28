import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://api-private.atlassian.com/users/2746d5624764ee676c08cdd3bfb77761/avatar",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
