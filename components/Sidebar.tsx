
import React, { useState } from 'react';
import { NODE_CONFIG } from '../constants';
import { NodeType } from '../types';

interface SidebarProps {
  onAddNode: (type: NodeType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = Object.entries(NODE_CONFIG).filter(([, config]) => {
    if (searchTerm === '') return true;
    return (
      config.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <aside className="absolute top-0 left-0 bottom-0 w-64 bg-gray-800/80 backdrop-blur-sm border-r border-gray-700 p-4 pt-24 z-10 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">Nodes</h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div className="space-y-2">
        {filteredNodes.map(([type, config]) => (
          <button
            key={type}
            onClick={() => onAddNode(type as NodeType)}
            className="w-full flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
          >
            <div className="text-indigo-400 mr-3">{config.icon}</div>
            <div>
              <p className="font-semibold text-gray-100">{config.label}</p>
              <p className="text-xs text-gray-400">{config.description}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
