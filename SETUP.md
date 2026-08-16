# Setup Guide

## 1. Install Ollama

- **macOS/Linux**: `curl -fsSL https://ollama.com/install.sh | sh`
- **Windows**: Download from https://ollama.com/download

## 2. Pull a Model

```bash
ollama pull mistral
```

## 3. Start Ollama

```bash
ollama serve
```

## 4. Install Backend

```bash
cd backend
cp .env.example .env   # edit as needed
npm install
npm run dev
```

Backend available at: http://localhost:5000

## 5. Install Frontend

```bash
cd frontend
cp .env.example .env   # edit as needed
npm install
npm start
```

Frontend available at: http://localhost:3000

## Switching Models

Change `OLLAMA_MODEL` in `backend/.env` to any model available in Ollama:

```env
OLLAMA_MODEL=llama3
```

Then pull the model: `ollama pull llama3`

## Troubleshooting

| Problem | Solution |
|---|---|
| "Ollama not available" | Run `ollama serve` |
| Model not found | Run `ollama pull mistral` |
| Backend won't start | Check `backend/.env`, ensure port 5000 is free |
| Frontend blank | Check `REACT_APP_API_URL` in `frontend/.env` |
