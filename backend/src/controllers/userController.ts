import { Request, Response } from "express";
import { User } from "../models/user";
import { updateUserProfile } from "../services/userService";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const { tech, disponibilidade, experiencia } = req.query;

    const filters: any = {};

    if (tech) {
      const techArray = Array.isArray(tech) ? tech : [tech];
      filters.technologies = { $all: techArray };
    }

    if (disponibilidade) {
      filters.availability = disponibilidade;
    }

    if (experiencia) {
      filters.experienceLevel = experiencia;
    }

    const users = await User.find(filters).select("-password");
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao listar usuários" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    console.log("id do usuario", userId);
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    const updates = req.body;

    const updatedUser = await updateUserProfile(userId, updates);

    res.status(200).json(updatedUser);
  } catch (err: any) {
    if (err.message === "Usuário não encontrado") {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
  }
};
