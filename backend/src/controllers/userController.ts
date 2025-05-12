import { Request, Response } from "express";
import { User } from "../models/User";

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
