const express = require('express');
const router = express.Router({ mergeParams: true });
const { getConversationById, updateConversationTimestamp } = require('../models/conversation');
const { createMessage, listMessages, deleteMessage } = require('../models/message');
const { AGENTS } = require('./agents');
const { chat } = require('../utils/ollama');

// GET /api/conversations/:id/messages - get all messages in a conversation
router.get('/', (req, res, next) => {
  try {
    const conversation = getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    const messages = listMessages(req.params.id);
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// POST /api/conversations/:id/messages - send a message and get a response
router.post('/', async (req, res, next) => {
  try {
    const conversation = getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const { content } = req.body;
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const agent = AGENTS.find((a) => a.id === conversation.agent_id);
    if (!agent) {
      return res.status(500).json({ error: 'Agent configuration not found' });
    }

    // Save user message
    const userMessage = createMessage({
      conversationId: conversation.id,
      role: 'user',
      content: content.trim(),
    });

    // Build the messages array for Ollama
    const history = listMessages(conversation.id);
    const ollamaMessages = [
      { role: 'system', content: agent.systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ];

    // Call Ollama
    let assistantContent;
    try {
      assistantContent = await chat({
        model: agent.model,
        messages: ollamaMessages,
      });
    } catch (ollamaErr) {
      return res.status(503).json({
        error: 'Ollama is not available. Please ensure Ollama is running and the model is pulled.',
        details: ollamaErr.message,
      });
    }

    // Save assistant message
    const assistantMessage = createMessage({
      conversationId: conversation.id,
      role: 'assistant',
      content: assistantContent,
      agentId: agent.id,
    });

    updateConversationTimestamp(conversation.id);

    res.status(201).json({
      userMessage,
      assistantMessage,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/conversations/:id/messages/:messageId - delete a message
router.delete('/:messageId', (req, res, next) => {
  try {
    const conversation = getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    const deleted = deleteMessage(req.params.messageId);
    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
