import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @openapi
 * /api/auth/register:
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
 * /api/auth/login:
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
 * /api/auth/github:
 *   get:
 *     summary: Inicia a autenticação com o GitHub
 *     tags:
 *       - Autenticação
 *     responses:
 *       302:
 *         description: Redireciona para o GitHub para autenticação
 */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

/**
 * @openapi
 * /api/auth/github/callback:
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
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

/**
 * @openapi
 * /api/auth/github/connect:
 *   get:
 *     summary: Conecta uma conta GitHub a um usuário autenticado
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       302:
 *         description: Redireciona para o GitHub para vincular a conta
 */
router.get(
  "/github/connect",
  authenticate,
  passport.authorize("github", { scope: ["user:email"] })
);

/**
 * @openapi
 * /api/auth/github/connect/callback:
 *   get:
 *     summary: Callback para vincular conta GitHub a um usuário autenticado
 *     tags:
 *       - Autenticação
 *     responses:
 *       200:
 *         description: Conta GitHub vinculada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get(
  "/github/connect/callback",
  passport.authorize("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || "/"); // ou retornar JSON, se preferir
  }
);

export default router;
