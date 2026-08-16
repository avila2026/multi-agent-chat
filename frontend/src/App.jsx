import React, { useState } from 'react';
import { useChat } from './hooks/useChat';
import ChatWindow from './components/ChatWindow';
import ConversationHistory from './components/ConversationHistory';

function App() {
  const {
    agents,
    conversations,
    activeConversation,
    messages,
    selectedAgent,
    setSelectedAgent,
    isLoading,
    isTyping,
    error,
    messagesEndRef,
    startNewConversation,
    selectConversation,
    removeConversation,
    submit,
  } = useChat();

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-base font-bold text-gray-900 dark:text-white">💬 Multi-Agent Chat</h1>
        </div>

        <ConversationHistory
          conversations={conversations}
          activeConversation={activeConversation}
          onSelect={selectConversation}
          onDelete={removeConversation}
        />
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="btn-secondary p-2 text-sm"
            title="Toggle sidebar"
          >
            ☰
          </button>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate flex-1">
            {activeConversation ? activeConversation.title : 'Select a conversation'}
          </span>
          <button
            onClick={toggleDarkMode}
            className="btn-secondary p-2 text-sm"
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <ChatWindow
          agents={agents}
          messages={messages}
          activeConversation={activeConversation}
          selectedAgent={selectedAgent}
          isLoading={isLoading}
          isTyping={isTyping}
          error={error}
          messagesEndRef={messagesEndRef}
          onAgentSelect={setSelectedAgent}
          onSend={submit}
          onNewChat={startNewConversation}
        />
      </main>
    </div>
  );
}

export default App;
