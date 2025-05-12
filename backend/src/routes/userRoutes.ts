import { Router } from "express";
import {
  listUsers,
  getUserById,
  updateProfile,
} from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @openapi
 * /api/users:
 *  get:
 *    summary: Lista usuários com filtros opcionais
 *    tags:
 *      - Usuários
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: tech
 *        in: query
 *        required: false
 *        schema:
 *          type: string
 *      - name: disponibilidade
 *        in: query
 *        description: Disponibilidade do usuário (Freelancer, Full-time, etc.)
 *        required: false
 *        schema:
 *          type: string
 *      - name: experiencia
 *        in: query
 *        description: Nível de experiência (Junior, Pleno, Senior)
 *        required: false
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Lista de usuários
 */
router.get("/users", authenticate, listUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Retorna um usuário específico pelo ID
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário no banco
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/users/:id", authenticate, getUserById);

/**
 * @openapi
 * /api/users/me:
 *   put:
 *     summary: Atualiza os dados do perfil do usuário autenticado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       401:
 *         description: Não autenticado
 */

router.put("/users/me", authenticate, updateProfile);

export default router;
