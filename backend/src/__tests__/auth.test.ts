import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import { User } from "../models/user";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Auth - Registro", () => {
  it("deve registrar um novo usuário com sucesso", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "senha123",
      username: "testuser",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(
      "message",
      "Usuário registrado com sucesso"
    );
    expect(res.body).toHaveProperty("token");
  });

  it("deve retornar erro se o email já existir", async () => {
    await User.create({
      email: "test@example.com",
      password: "123",
      username: "jáexiste",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "senha123",
      username: "outro",
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error", "Email já registrado");
  });
});

describe("Auth - Registro com campos faltando", () => {
  it("deve retornar erro se o email estiver ausente", async () => {
    const res = await request(app).post("/api/auth/register").send({
      password: "senha123",
      username: "usersememail",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Campos obrigatórios ausentes");
  });

  it("deve retornar erro se o password estiver ausente", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "sem@senha.com",
      username: "semSenha",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Campos obrigatórios ausentes");
  });

  it("deve retornar erro se o username estiver ausente", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "sem@nome.com",
      password: "senha123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Campos obrigatórios ausentes");
  });
});

describe("Auth - Login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      email: "login@example.com",
      password: "senha123",
      username: "logintest",
    });
  });

  it("deve fazer login com credenciais corretas", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "senha123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Login bem-sucedido");
    expect(res.body).toHaveProperty("token");
  });

  it("deve falhar ao fazer login com senha incorreta", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "senhaErrada",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Email ou senha incorretos");
  });

  it("deve falhar ao fazer login com email inexistente", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "naoexiste@example.com",
      password: "senha123",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Credenciais inválidas");
  });
});

describe("Auth - Login com campos faltando", () => {
  it("deve retornar erro se o email estiver ausente", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "senha123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Campos obrigatórios ausentes");
  });

  it("deve retornar erro se o password estiver ausente", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "falta@senha.com",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Campos obrigatórios ausentes");
  });
});
