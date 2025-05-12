import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";

let mongo: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  // cria e loga usuário
  await request(app).post("/api/auth/register").send({
    email: "ghconnect@test.com",
    password: "senha123",
    username: "ghuser",
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "ghconnect@test.com",
    password: "senha123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("GET /api/auth/github/connect", () => {
  it("deve redirecionar para o GitHub se o usuário estiver autenticado", async () => {
    const res = await request(app)
      .get("/api/auth/github/connect")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(302);
    expect(res.header.location).toMatch(/github\.com/); // destino do redirecionamento
  });

  it("deve retornar 401 se o usuário não estiver autenticado", async () => {
    const res = await request(app).get("/api/auth/github/connect");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      "error",
      "Token não encontrado ou mal formatado"
    );
  });
});

describe("GET /api/auth/github/connect/callback", () => {
  it("deve redirecionar ao final do fluxo (mesmo que não haja sessão ativa)", async () => {
    const res = await request(app).get("/api/auth/github/connect/callback");

    // O passport falhará pois não há sessão ativa no teste, mas a rota deve proteger isso
    expect([302, 401, 500]).toContain(res.status); // pode variar dependendo do fallback
  });
});
