import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/authController";
import { githubCallback } from "../controllers/authController";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário com email e senha
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Campos obrigatórios ausentes
 *       409:
 *         description: Email já registrado
 */
router.post("/register", register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login com email e senha
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", login);

/**
 * @openapi
 * /auth/github:
 *   get:
 *     summary: Inicia a autenticação com o GitHub
 *     tags:
 *       - Autenticação
 *     responses:
 *       302:
 *         description: Redireciona para o GitHub para autenticação
 */
router.get(
  "/auth/github",
  passport.authorize("github", { scope: ["user:email"] })
);

/**
 * @openapi
 * /auth/github/callback:
 *   get:
 *     summary: Callback da autenticação do GitHub
 *     tags:
 *       - Autenticação
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *       401:
 *         description: Falha na autenticação
 */
router.get(
  "/auth/github/callback",
  passport.authorize("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

export default router;
