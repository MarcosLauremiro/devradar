import jwt from "jsonwebtoken";
import { IUser } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const generateToken = (user: IUser) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};
