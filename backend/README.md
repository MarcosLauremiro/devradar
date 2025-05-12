# 📍 DevTracker API

**DevTracker** é uma API open source para rastrear desenvolvedores em um mapa interativo, permitindo filtrar por tecnologias, experiência e disponibilidade. Criada com *Node.js + Express + MongoDB + Passport + Swagger.*

### 🚀 Tecnologias Utilizadas

- Node.js + Express (API REST)

- TypeScript

- MongoDB (com Mongoose)

- JWT para autenticação

- GitHub OAuth com Passport.js

- Swagger para documentação

- Jest + Supertest para testes automatizados

- mongodb-memory-server para testes isolados

### 📦 Instalação

```
git clone https://github.com/seu-usuario/devtracker.git  # Clona o repositorio
cd devtracker                                            # Entrar na pasta
npm install                                              # Instalar dependencias
```

### 📁 Arquivo .env

```
PORT=
MONGODB_URI=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
JWT_SECRET=
FRONTEND_URL=
```

### 🛠️ Scripts

```
npm run dev       # Inicia servidor em modo desenvolvimento
npm run build     # Compila para produção
npm test          # Roda testes automatizados

```

### 🧪 Testes

```
npm test
```

### 📘 Documentação da API (Swagger)

```
http://localhost:5000/api-docs
```

## 📌 Padrões de Nomenclatura

### Rotas

- Todas as rotas começam com /api
- Todas as rotas de autenticação com /auth

1.Uso de recursos RESTful:

- GET /api/users

- PUT /api/users/me

- POST /auth/register

- POST /auth/login

Nome de campos no ```User```

| Campo             | Tipo      | Descrição                    |
| ----------------- | --------- | ---------------------------- |
| `email`           | string    | E-mail único do usuário      |
| `username`        | string    | Nome de usuário              |
| `password`        | string    | Hashed                       |
| `name`            | string    | Nome completo                |
| `bio`             | string    | Descrição curta              |
| `technologies`    | string\[] | Lista de stacks              |
| `experienceLevel` | string    | Junior, Pleno, Senior        |
| `availability`    | string    | Freelancer, Full-time etc    |
| `githubId`        | string    | ID da conta GitHub vinculada |

### 📥 Endpoints principais

| Método | Rota                   | Descrição                         | Autenticado |
| ------ | ---------------------- | --------------------------------- | ----------- |
| POST   | `/auth/register`       | Registrar via e-mail              | ❌           |
| POST   | `/auth/login`          | Login com e-mail/senha            | ❌           |
| GET    | `/auth/github`         | Inicia login com GitHub           | ❌           |
| GET    | `/auth/github/connect` | Vincular GitHub a conta existente | ✅           |
| PUT    | `/api/users/me`        | Atualiza o próprio perfil         | ✅           |
| GET    | `/api/users`           | Lista usuários com filtros        | ✅           |
| GET    | `/api/users/:id`       | Busca usuário por ID              | ✅           |

## 👥 Contribuindo

Quer ajudar? Siga as etapas:

1. Faça um fork do repositório

2. Crie sua branch: git checkout -b minha-feature

3. Faça commits claros: git commit -m "feat: nova funcionalidade"

4. Envie um PR para main

### Regras

- Use TypeScript

- Use camelCase para variáveis

- Escreva testes para novas features

- Atualize o Swagger quando criar ou alterar rotas

- Documente as mudanças no README se forem relevantes

### 💡 Futuras atualizações

- Filtro por geolocalização (CEP → coordenadas)

- Avatar do usuário via upload

- Modo público e privado de perfil

- Ranking de usuários ativos

- Integração com WhatsApp API
