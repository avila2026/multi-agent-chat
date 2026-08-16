# Multi-Agent Chat System

A complete multi-agent interactive chat system with Ollama integration.

## Features

- **Multiple AI Agents**: Technical Assistant 💻, Creative Assistant 🎨, Data Analysis Agent 📊
- **Ollama Integration**: Local LLM support (default: mistral)
- **Interactive Chat Interface**: Real-time conversation
- **Conversation History**: Persistent SQLite storage
- **Responsive UI**: React + Tailwind CSS with dark mode

## Quick Start

### Prerequisites

1. [Node.js](https://nodejs.org/) ≥ 18
2. [Ollama](https://ollama.com/) installed and running
3. A model pulled: `ollama pull mistral`

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/avila2026/multi-agent-chat.git
cd multi-agent-chat

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run dev   # starts on http://localhost:5000

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm start     # starts on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `OLLAMA_URL` | `http://localhost:11434` | Ollama API URL |
| `OLLAMA_MODEL` | `mistral` | Default model |
| `DB_PATH` | `./chat.db` | SQLite database path |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000` | Backend API URL |

## API Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/agents` | List available agents |
| `GET` | `/api/conversations` | List conversations |
| `POST` | `/api/conversations` | Create conversation |
| `GET` | `/api/conversations/:id/messages` | Get messages |
| `POST` | `/api/conversations/:id/messages` | Send message |
| `DELETE` | `/api/conversations/:id` | Delete conversation |

## Docker

```bash
docker-compose up --build
```

## Tech Stack

- **Backend**: Node.js + Express.js + SQLite (`better-sqlite3`)
- **Frontend**: React 18 + Tailwind CSS
- **LLM**: Ollama (local) 
