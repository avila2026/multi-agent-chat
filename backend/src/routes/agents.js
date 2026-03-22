const express = require('express');
const router = express.Router();
const technicalAgent = require('../agents/technicalAgent');
const creativeAgent = require('../agents/creativeAgent');
const dataAnalysisAgent = require('../agents/dataAnalysisAgent');
const { healthCheck } = require('../utils/ollama');

const AGENTS = [technicalAgent, creativeAgent, dataAnalysisAgent];

// GET /api/agents - list available agents
router.get('/', async (req, res, next) => {
  try {
    const ollamaAvailable = await healthCheck();
    const agents = AGENTS.map(({ id, name, description, icon, color, model }) => ({
      id,
      name,
      description,
      icon,
      color,
      model,
      available: ollamaAvailable,
    }));
    res.json({ agents, ollamaAvailable });
  } catch (err) {
    next(err);
  }
});

// GET /api/agents/:id - get a single agent
router.get('/:id', (req, res, next) => {
  try {
    const agent = AGENTS.find((a) => a.id === req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    const { id, name, description, icon, color, model } = agent;
    res.json({ id, name, description, icon, color, model });
  } catch (err) {
    next(err);
  }
});

module.exports = { router, AGENTS };
