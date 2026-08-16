const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './chat.db';

let db;

function getDb() {
  if (!db) {
    const dbDir = path.dirname(DB_PATH);
    if (dbDir !== '.' && !fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    migrate(db);
  }
  return db;
}

function migrate(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      agent_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
      ON messages(conversation_id);

    CREATE INDEX IF NOT EXISTS idx_conversations_updated_at
      ON conversations(updated_at DESC);
  `);
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
