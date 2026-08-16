import React, { useState } from 'react';

function ConversationHistory({ conversations, activeConversation, onSelect, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search conversations…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 p-4">
            {searchTerm ? 'No results' : 'No conversations yet'}
          </p>
        ) : (
          filtered.map((conv) => {
            const isActive = activeConversation?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`group flex items-start gap-2 p-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors
                  ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {conv.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this conversation?')) {
                      onDelete(conv.id);
                    }
                  }}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1 rounded"
                  title="Delete conversation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConversationHistory;
