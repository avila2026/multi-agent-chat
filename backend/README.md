# Multi-Agent Chat – Backend

Express.js REST API with SQLite persistence and Ollama integration.

## Start

```bash
cp .env.example .env
npm install
npm run dev
```

## Endpoints

- `GET /api/agents`
- `POST /api/conversations`
- `GET /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages`
- `DELETE /api/conversations/:id`
