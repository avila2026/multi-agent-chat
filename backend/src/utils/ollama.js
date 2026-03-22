const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'mistral';

/**
 * Send a chat request to Ollama and return the full response text.
 */
async function chat({ model = DEFAULT_MODEL, messages, options = {} }) {
  const response = await axios.post(
    `${OLLAMA_URL}/api/chat`,
    {
      model,
      messages,
      stream: false,
      options,
    },
    { timeout: 120000 }
  );

  const message = response.data?.message;
  if (!message) {
    throw new Error('Invalid response from Ollama: missing message field');
  }
  return message.content;
}

/**
 * Stream a chat response from Ollama. Calls onChunk(text) for each token
 * and returns the full accumulated response.
 */
async function chatStream({ model = DEFAULT_MODEL, messages, options = {}, onChunk }) {
  const response = await axios.post(
    `${OLLAMA_URL}/api/chat`,
    {
      model,
      messages,
      stream: true,
      options,
    },
    {
      responseType: 'stream',
      timeout: 120000,
    }
  );

  return new Promise((resolve, reject) => {
    let fullContent = '';
    let buffer = '';

    response.data.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          const token = parsed?.message?.content || '';
          if (token) {
            fullContent += token;
            if (onChunk) onChunk(token);
          }
        } catch {
          // ignore malformed lines
        }
      }
    });

    response.data.on('end', () => resolve(fullContent));
    response.data.on('error', reject);
  });
}

/**
 * List models available in Ollama.
 */
async function listModels() {
  const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 10000 });
  return response.data?.models || [];
}

/**
 * Check if Ollama is reachable.
 */
async function healthCheck() {
  try {
    await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

module.exports = { chat, chatStream, listModels, healthCheck, DEFAULT_MODEL };
