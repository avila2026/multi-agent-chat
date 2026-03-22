const express = require('express');
const router = express.Router();
const {
  createConversation,
  listConversations,
  getConversationById,
  deleteConversation,
} = require('../models/conversation');
const { AGENTS } = require('./agents');

// GET /api/conversations - list all conversations
router.get('/', (req, res, next) => {
  try {
    const conversations = listConversations();
    res.json({ conversations });
  } catch (err) {
    next(err);
  }
});

// POST /api/conversations - create a new conversation
router.post('/', (req, res, next) => {
  try {
    const { agentId, title } = req.body;

    if (!agentId) {
      return res.status(400).json({ error: 'agentId is required' });
    }

    const agent = AGENTS.find((a) => a.id === agentId);
    if (!agent) {
      return res.status(400).json({ error: `Unknown agent: ${agentId}` });
    }

    const conversationTitle =
      title || `Chat with ${agent.name} – ${new Date().toLocaleDateString()}`;

    const conversation = createConversation({ agentId, title: conversationTitle });
    res.status(201).json({ conversation });
  } catch (err) {
    next(err);
  }
});

// GET /api/conversations/:id - get a conversation
router.get('/:id', (req, res, next) => {
  try {
    const conversation = getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ conversation });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/conversations/:id - delete a conversation and its messages
router.delete('/:id', (req, res, next) => {
  try {
    const deleted = deleteConversation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
