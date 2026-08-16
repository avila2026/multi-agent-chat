const { getDb } = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

function createMessage({ conversationId, role, content, agentId = null }) {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO messages (id, conversation_id, role, content, agent_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, conversationId, role, content, agentId, now);

  return getMessageById(id);
}

function getMessageById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
}

function listMessages(conversationId) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `).all(conversationId);
}

function deleteMessage(id) {
  const db = getDb();
  const result = db.prepare('DELETE FROM messages WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = {
  createMessage,
  getMessageById,
  listMessages,
  deleteMessage,
};
