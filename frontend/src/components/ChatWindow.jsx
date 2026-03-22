import React from 'react';
import AgentSelector from './AgentSelector';
import MessageList from './MessageList';
import InputForm from './InputForm';

function ChatWindow({
  agents,
  messages,
  activeConversation,
  selectedAgent,
  isLoading,
  isTyping,
  error,
  messagesEndRef,
  onAgentSelect,
  onSend,
  onNewChat,
}) {
  const handleNewChat = () => {
    if (!selectedAgent) return;
    onNewChat(selectedAgent.id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-3 flex-wrap">
        <AgentSelector
          agents={agents}
          selectedAgent={selectedAgent}
          onSelect={onAgentSelect}
          disabled={isLoading}
        />
        <button
          onClick={handleNewChat}
          disabled={!selectedAgent || isLoading}
          className="btn-primary text-sm px-4 py-2 flex-shrink-0"
        >
          + New Chat
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-start gap-2">
          <span className="text-red-500 flex-shrink-0">⚠</span>
          <p className="text-sm text-red-700 dark:text-red-300 flex-1">{error}</p>
          <button
            onClick={() => {}}
            className="text-red-400 hover:text-red-600 flex-shrink-0 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
        activeConversation={activeConversation}
        agents={agents}
      />

      {/* Input */}
      {activeConversation && (
        <InputForm
          onSend={onSend}
          disabled={isLoading}
          placeholder={`Message ${selectedAgent?.name || 'agent'}…`}
        />
      )}
    </div>
  );
}

export default ChatWindow;
