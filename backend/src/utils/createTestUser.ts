// src/tests/utils/createTestUser.ts
import request from "supertest";
import app from "../app";

export const createAndLoginUser = async (
  email: string = "test@example.com",
  password: string = "senha123",
  username: string = "testuser"
): Promise<{ token: string }> => {
  // registra o usuário
  await request(app).post("/api/auth/register").send({
    email,
    password,
    username,
  });

  // faz login para pegar o token
  const loginRes = await request(app).post("/api/auth/login").send({
    email,
    password,
  });
  console.log("TOKEN OBTIDO:", loginRes.body.token);
  return { token: loginRes.body.token };
};
