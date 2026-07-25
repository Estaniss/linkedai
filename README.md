# LinkedAI — Fase 1

Autenticação, perfil profissional, upload de currículo, enriquecimento por IA e dashboard esqueleto.

## Setup local (sem Docker)

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL, GOOGLE_CLIENT_ID/SECRET, OPENAI_API_KEY, ENCRYPTION_KEY

# Postgres precisa da extensão pgvector habilitada. Se estiver usando um Postgres local:
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS vector;"

npx prisma migrate dev --name init
npm run dev
```

Acesse `http://localhost:3000`.

## Setup com Docker (recomendado)

```bash
cp .env.example .env   # preencha GOOGLE_CLIENT_ID/SECRET, OPENAI_API_KEY, ENCRYPTION_KEY
docker compose up --build
```

O `docker-compose.yml` já sobe Postgres com pgvector pré-habilitado (`pgvector/pgvector:pg16`) e Redis
(usado a partir da Fase 2). Depois do primeiro `up`, rode as migrations dentro do container:

```bash
docker compose exec app npx prisma migrate deploy
```

## Variáveis de ambiente obrigatórias

Veja `.env.example`. Destaque para:
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: criar em https://console.cloud.google.com/apis/credentials,
  com redirect URI `http://localhost:3000/api/auth/callback/google`.
- `OPENAI_API_KEY`: usada em `build-structured-profile` e `generate-profile-embedding`.
- `ENCRYPTION_KEY`: `openssl rand -hex 32` (usada a partir da Fase 3 para dados sensíveis).

## O que existe nesta fase

- Login via Google (NextAuth, session strategy "database")
- Wizard de perfil profissional em 4 passos (`/profile`) — React Hook Form + Zod + Zustand
- Upload de currículo em PDF com extração de texto (`pdf-parse`)
- Enriquecimento do perfil via IA: resumo estruturado, hard/soft skills, resumo ATS (`/api/resume/parse`)
- Embedding do perfil persistido via pgvector (usado no matching a partir da Fase 2)
- Dashboard esqueleto (`/dashboard`) com o resumo gerado pela IA e placeholders das métricas futuras

## Estrutura

Segue a arquitetura definida no documento `LinkedAI-Arquitetura.md`: Presentation (`src/app`) →
Application (`src/modules/*/use-cases`) → Domain (`src/modules/*/domain`) → Infrastructure
(`src/infrastructure`). Route handlers são o único lugar que instancia repositórios/providers
concretos e os injeta nos use cases.

## Próximos passos (Fase 2)

- Adapters de ATS (Greenhouse, Lever) implementando `AtsProvider`
- `IngestManualJob` (colar link do LinkedIn/outros)
- `CalculateCompatibility` com busca vetorial (pgvector) + regras explícitas
- Worker de busca periódica (BullMQ, já com Redis disponível no compose)
