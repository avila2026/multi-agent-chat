import React from 'react';
import ReactMarkdown from 'react-markdown';

const AGENT_ICONS = {
  technical: '💻',
  creative: '🎨',
  'data-analysis': '📊',
};

function MessageBubble({ message, agentName }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm mr-2 mt-1">
          {AGENT_ICONS[message.agent_id] || '🤖'}
        </div>
      )}

      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isUser && agentName && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">{agentName}</span>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 mx-1">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm ml-2 mt-1">
          👤
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm mr-2 mt-1">
        🤖
      </div>
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

function MessageList({ messages, isTyping, messagesEndRef, activeConversation, agents }) {
  const agentMap = Object.fromEntries((agents || []).map((a) => [a.id, a]));
  const currentAgent = activeConversation ? agentMap[activeConversation.agent_id] : null;

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center">
        <div>
          <p className="text-4xl mb-3">💬</p>
          <p className="text-lg font-medium">Select or start a conversation</p>
          <p className="text-sm mt-1">Choose an agent and click "New Chat" to begin</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center">
        <div>
          <p className="text-4xl mb-3">{currentAgent?.icon || '🤖'}</p>
          <p className="text-lg font-medium">Chat with {currentAgent?.name || 'Agent'}</p>
          <p className="text-sm mt-1">{currentAgent?.description || 'Send a message to start'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto messages-container p-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          agentName={currentAgent?.name}
        />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
