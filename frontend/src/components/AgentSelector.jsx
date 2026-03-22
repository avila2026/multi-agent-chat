import React from 'react';

const AGENT_COLORS = {
  blue: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200',
  green: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200',
};

const RING_COLORS = {
  blue: 'ring-blue-500',
  purple: 'ring-purple-500',
  green: 'ring-green-500',
};

function AgentSelector({ agents, selectedAgent, onSelect, disabled }) {
  if (!agents || agents.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="animate-pulse">Loading agents…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {agents.map((agent) => {
        const isSelected = selectedAgent?.id === agent.id;
        const colorCls = AGENT_COLORS[agent.color] || AGENT_COLORS.blue;
        const ringCls = RING_COLORS[agent.color] || RING_COLORS.blue;

        return (
          <button
            key={agent.id}
            onClick={() => onSelect(agent)}
            disabled={disabled}
            title={agent.description}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-150
              ${colorCls}
              ${isSelected ? `ring-2 ${ringCls} scale-105` : 'opacity-70 hover:opacity-100'}
              disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <span>{agent.icon}</span>
            <span>{agent.name}</span>
            {!agent.available && (
              <span className="ml-1 text-xs text-red-500" title="Ollama not available">
                ⚠
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default AgentSelector;
