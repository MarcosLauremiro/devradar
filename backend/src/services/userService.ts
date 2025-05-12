import { User } from "../models/User";

export const getAllUsers = async () => {
  return await User.find();
};

export const getUserByGithubId = async (githubId: string) => {
  return await User.findOne({ githubId });
};
