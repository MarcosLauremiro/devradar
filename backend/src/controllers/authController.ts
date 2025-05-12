import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { comparePassword } from "../utils/hash";
import { loginUser, registerUser } from "../services/authService";
import { handleGitHubLogin } from "../services/authService";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const { user, token } = await registerUser(email, password, username);

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Campos obrigatórios ausentes" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const match = await comparePassword(password, user.password as string);
    if (!match) {
      res.status(401).json({ error: "Email ou senha incorretos" });
      return;
    }

    const { token } = await loginUser(email, password);

    res.status(200).json({ message: "Login bem-sucedido", token });
  } catch (err) {
    res.status(500).json({ error: "Erro no login" });
  }
};

export const githubCallback = async (req: Request, res: Response) => {
  try {
    const { user, token } = await handleGitHubLogin(req.user);
    res.status(200).json({
      message: "Autenticação via GitHub bem-sucedida",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro na autenticação via GitHub" });
  }
};
