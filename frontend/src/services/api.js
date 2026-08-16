import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000,
});

// Agents
export const fetchAgents = () => api.get('/api/agents').then((r) => r.data);

// Conversations
export const fetchConversations = () =>
  api.get('/api/conversations').then((r) => r.data.conversations);

export const createConversation = (agentId, title) =>
  api.post('/api/conversations', { agentId, title }).then((r) => r.data.conversation);

export const deleteConversation = (id) => api.delete(`/api/conversations/${id}`);

// Messages
export const fetchMessages = (conversationId) =>
  api.get(`/api/conversations/${conversationId}/messages`).then((r) => r.data.messages);

export const sendMessage = (conversationId, content) =>
  api
    .post(`/api/conversations/${conversationId}/messages`, { content })
    .then((r) => r.data);

export default api;
