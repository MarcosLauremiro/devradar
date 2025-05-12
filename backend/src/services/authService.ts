import { User } from "../models/User";
import { generateToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/hash";

export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email já registrado");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    email,
    password: hashedPassword,
    username,
  });

  const token = generateToken(user);

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new Error("Credenciais inválidas");
  }

  const match = await comparePassword(password, user.password as string);
  if (!match) {
    throw new Error("Email ou senha incorretos");
  }

  const token = generateToken(user);

  return { token };
};

export const handleGitHubLogin = async (profile: any) => {
  const existingUser = await User.findOne({ githubId: profile.id });

  if (existingUser) {
    const token = generateToken(existingUser);
    return { user: existingUser, token };
  }

  const newUser = await User.create({
    githubId: profile.id,
    username: profile.username,
    name: profile.displayName,
    avatarUrl: profile.photos?.[0]?.value,
    bio: profile._json?.bio,
    technologies: [],
  });

  const token = generateToken(newUser);
  return { user: newUser, token };
};
