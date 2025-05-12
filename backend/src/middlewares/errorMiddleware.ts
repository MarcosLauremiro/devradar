import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error("Erro inesperado:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
};
