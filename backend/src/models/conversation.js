const { getDb } = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

function createConversation({ agentId, title }) {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO conversations (id, title, agent_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, title, agentId, now, now);

  return getConversationById(id);
}

function listConversations({ limit = 50, offset = 0 } = {}) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM conversations
    ORDER BY updated_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);
}

function getConversationById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
}

function updateConversationTimestamp(id) {
  const db = getDb();
  db.prepare(`
    UPDATE conversations SET updated_at = ? WHERE id = ?
  `).run(new Date().toISOString(), id);
}

function deleteConversation(id) {
  const db = getDb();
  const result = db.prepare('DELETE FROM conversations WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = {
  createConversation,
  listConversations,
  getConversationById,
  updateConversationTimestamp,
  deleteConversation,
};
