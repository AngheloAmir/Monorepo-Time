
import React from 'react';

export interface AgentType {
  type: string;
  label: string;
  icon: string;
  description: string;
}

const AVAILABLE_AGENTS: AgentType[] = [
  { type: 'agent', label: 'Researcher', icon: '🔍', description: 'Gathers information and context.' },
  { type: 'agent', label: 'Coder', icon: '💻', description: 'Writes and modifies code.' },
  { type: 'agent', label: 'Reviewer', icon: '👀', description: 'Reviews code and suggestions.' },
  { type: 'agent', label: 'Writer', icon: '📝', description: 'Writes documentation and content.' },
  { type: 'agent', label: 'Planner', icon: '📅', description: 'Creates plans and steps.' },
];

export default function OpencodeAgents() {
  const onDragStart = (event: React.DragEvent, nodeData: AgentType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800 p-4">
      <h2 className="text-zinc-100 font-bold mb-4 text-sm uppercase tracking-wider">Available Agents</h2>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {AVAILABLE_AGENTS.map((agent) => (
          <div
            key={agent.label}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded cursor-grab hover:bg-zinc-700 hover:border-zinc-600 transition-all shadow-sm group"
            onDragStart={(event) => onDragStart(event, agent)}
            draggable
          >
            <div className="flex items-center gap-3">
              <span className="text-xl group-hover:scale-110 transition-transform block">{agent.icon}</span>
              <div>
                <div className="text-zinc-200 font-medium text-sm">{agent.label}</div>
                <div className="text-zinc-500 text-xs">{agent.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto pt-4 border-t border-zinc-800 text-xs text-zinc-500">
        Drag and drop agents onto the workflow canvas.
      </div>
    </div>
  );
}