import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import { User } from "../models/user";
import { createAndLoginUser } from "../utils/createTestUser";

let mongo: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  const res = await createAndLoginUser(
    "list@example.com",
    "senha123",
    "listar"
  );
  token = res.token;

  await User.create([
    {
      email: "react@example.com",
      password: "senha123",
      username: "reactdev",
      technologies: ["React", "Node"],
      availability: "Freelancer",
      experienceLevel: "Pleno",
    },
    {
      email: "python@example.com",
      password: "senha123",
      username: "pydev",
      technologies: ["Python", "Flask"],
      availability: "Full-time",
      experienceLevel: "Senior",
    },
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("GET /api/users", () => {
  it("deve retornar todos os usuários autenticado", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("deve filtrar usuários por tecnologia", async () => {
    const res = await request(app)
      .get("/api/users?tech=React")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].technologies).toContain("React");
  });

  it("deve retornar erro se não estiver autenticado", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /api/users/:id", () => {
  let userId: string;

  beforeAll(async () => {
    const user = (await User.create({
      email: "detail@example.com",
      password: "senha123",
      username: "detalhado",
      technologies: ["Node"],
      availability: "Full-time",
      experienceLevel: "Junior",
    })) as mongoose.Document & { _id: mongoose.Types.ObjectId };

    userId = user._id.toString();
  });

  it("deve retornar os dados de um usuário existente", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", userId);
    expect(res.body).toHaveProperty("username", "detalhado");
  });

  it("deve retornar 404 se o usuário não existir", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Usuário não encontrado");
  });

  it("deve retornar 401 se não estiver autenticado", async () => {
    const res = await request(app).get(`/api/users/${userId}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      "error",
      "Token não encontrado ou mal formatado"
    );
  });
});

describe("PUT /api/users/me", () => {
  let updateToken: string;

  beforeAll(async () => {
    const res = await createAndLoginUser(
      "update@example.com",
      "senha123",
      "updateuser"
    );
    updateToken = res.token;
  });

  it("deve atualizar múltiplos campos do perfil", async () => {
    const res = await request(app)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${updateToken}`)
      .send({
        name: "Usuário Atualizado",
        bio: "Nova bio sobre devs",
        technologies: ["TypeScript", "GraphQL"],
        availability: "Full-time",
        experienceLevel: "Senior",
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Usuário Atualizado");
    expect(res.body.technologies).toContain("TypeScript");
    expect(res.body.experienceLevel).toBe("Senior");
  });

  it("não deve permitir atualizar email ou password", async () => {
    const res = await request(app)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${updateToken}`)
      .send({
        email: "hacker@mal.com",
        password: "senha123",
        name: "Tentando invadir",
      });

    expect(res.status).toBe(200);
    expect(res.body.email).not.toBe("hacker@mal.com");
  });
});
