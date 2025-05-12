import { IUser, User } from "../models/user";

export const getAllUsers = async () => {
  return await User.find();
};

export const getUserByGithubId = async (githubId: string) => {
  return await User.findOne({ githubId });
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<IUser>
) => {
  const protectedFields = ["_id", "email", "password", "githubId"];
  for (const field of protectedFields) {
    if (field in updates) {
      delete updates[field as keyof IUser];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  }).select("-password");

  if (!updatedUser) {
    throw new Error("Usuário não encontrado");
  }

  return updatedUser;
};
