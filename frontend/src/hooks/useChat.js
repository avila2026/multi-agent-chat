import { useState, useCallback, useEffect, useRef } from 'react';
import {
  fetchAgents,
  fetchConversations,
  createConversation,
  deleteConversation,
  fetchMessages,
  sendMessage,
} from '../services/api';

export function useChat() {
  const [agents, setAgents] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load agents once
  useEffect(() => {
    fetchAgents()
      .then(({ agents: list }) => {
        setAgents(list);
        if (list.length > 0) setSelectedAgent(list[0]);
      })
      .catch(() => setError('Failed to load agents. Is the backend running?'));
  }, []);

  // Load conversations once
  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch(() => {});
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    fetchMessages(activeConversation.id)
      .then(setMessages)
      .catch(() => setError('Failed to load messages'));
  }, [activeConversation]);

  // Scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const startNewConversation = useCallback(
    async (agentId, title) => {
      try {
        setError(null);
        const agent = agents.find((a) => a.id === agentId);
        const conv = await createConversation(agentId, title);
        setConversations((prev) => [conv, ...prev]);
        setActiveConversation(conv);
        if (agent) setSelectedAgent(agent);
        setMessages([]);
        return conv;
      } catch (err) {
        setError('Failed to create conversation');
        return null;
      }
    },
    [agents]
  );

  const selectConversation = useCallback((conv) => {
    setActiveConversation(conv);
    setError(null);
  }, []);

  const removeConversation = useCallback(
    async (id) => {
      try {
        await deleteConversation(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeConversation?.id === id) {
          setActiveConversation(null);
          setMessages([]);
        }
      } catch {
        setError('Failed to delete conversation');
      }
    },
    [activeConversation]
  );

  const submit = useCallback(
    async (content) => {
      if (!activeConversation || !content.trim()) return;

      setIsLoading(true);
      setIsTyping(true);
      setError(null);

      // Optimistically add user message
      const tempUserMsg = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        conversation_id: activeConversation.id,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      try {
        const { userMessage, assistantMessage } = await sendMessage(
          activeConversation.id,
          content
        );
        // Replace temp message with real one + add assistant response
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          userMessage,
          assistantMessage,
        ]);
        // Update conversations list timestamp
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation.id
              ? { ...c, updated_at: new Date().toISOString() }
              : c
          )
        );
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        const msg =
          err.response?.data?.error ||
          'Failed to send message. Check that Ollama is running.';
        setError(msg);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    },
    [activeConversation]
  );

  return {
    agents,
    conversations,
    activeConversation,
    messages,
    selectedAgent,
    setSelectedAgent,
    isLoading,
    isTyping,
    error,
    setError,
    messagesEndRef,
    startNewConversation,
    selectConversation,
    removeConversation,
    submit,
  };
}
