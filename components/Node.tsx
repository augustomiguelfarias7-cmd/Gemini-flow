import React, { memo } from 'react';
import { NodeType, NodeData, NodeExecutionStatus } from '../types';
import { NODE_CONFIG } from '../constants';

interface NodeProps {
  node: NodeData;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => void;
  onConnectorMouseDown: (e: React.MouseEvent<HTMLDivElement>, nodeId: string, isInput: boolean) => void;
  onConnectorMouseUp: (e: React.MouseEvent<HTMLDivElement>, nodeId: string, isInput: boolean) => void;
  onValueChange: (nodeId: string, value: string) => void;
}

const NodeComponent: React.FC<NodeProps> = ({ node, onMouseDown, onConnectorMouseDown, onConnectorMouseUp, onValueChange }) => {
  const config = NODE_CONFIG[node.type];

  const getBorderColor = () => {
    switch (node.data.status) {
      case NodeExecutionStatus.RUNNING:
        return 'border-yellow-500';
      case NodeExecutionStatus.SUCCESS:
        return 'border-green-500';
      case NodeExecutionStatus.ERROR:
        return 'border-red-500';
      default:
        return 'border-gray-700 hover:border-indigo-500';
    }
  };

  const renderContent = () => {
    switch (node.type) {
      case NodeType.TEXT_INPUT:
        return (
          <textarea
            value={node.data.value}
            onChange={(e) => onValueChange(node.id, e.target.value)}
            className="w-full h-24 bg-gray-900 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder={"Enter text here..."}
          />
        );
      case NodeType.PLAYWRIGHT:
        return (
          <textarea
            value={node.data.value}
            onChange={(e) => onValueChange(node.id, e.target.value)}
            className="w-full h-32 bg-gray-900 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-xs"
            placeholder={`Enter automation details as JSON.\n{\n  "url": "https://example.com",\n  "selectors": {\n    "title": "h1",\n    "firstParagraph": "p"\n  }\n}`}
          />
        );
      case NodeType.OUTPUT:
        return (
          <div className="w-full min-h-24 max-h-64 bg-gray-900 text-gray-200 p-2 rounded-md border border-gray-600 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{node.data.value || 'Output will appear here...'}</pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={node.id}
      className={`absolute w-72 bg-gray-800 rounded-lg shadow-xl border-2 transition-colors ${getBorderColor()}`}
      style={{ top: node.position.y, left: node.position.x }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      <div className="p-3 bg-gray-700/50 rounded-t-lg flex items-center space-x-3 cursor-move">
        <div className="text-indigo-400">{config.icon}</div>
        <h3 className="font-bold text-gray-100">{config.label}</h3>
      </div>
      
      {node.data.error && (
        <div className="p-3 text-red-400 text-xs border-t border-b border-gray-700">
          Error: {node.data.error}
        </div>
      )}

      {(node.type !== NodeType.START && node.type !== NodeType.GEMINI_PROMPT && node.type !== NodeType.WEB_SCRAPER) && (
        <div className="p-4 space-y-2 border-t border-gray-700">
          {renderContent()}
        </div>
      )}
       
       {node.type === NodeType.PLAYWRIGHT && node.data.status === NodeExecutionStatus.SUCCESS && (
         <div className="p-3 text-green-400 text-xs border-t border-gray-700">
          <pre className="whitespace-pre-wrap text-sm">{node.data.value}</pre>
        </div>
       )}
      
      {node.type === NodeType.OUTPUT && !node.data.value && node.data.status === NodeExecutionStatus.RUNNING && (
        <div className="p-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          Processing...
        </div>
      )}


      {config.hasInput && (
        <div
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-800 cursor-pointer hover:bg-indigo-500"
          onMouseDown={(e) => onConnectorMouseDown(e, node.id, true)}
          onMouseUp={(e) => onConnectorMouseUp(e, node.id, true)}
        />
      )}
      {config.hasOutput && (
        <div
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-800 cursor-pointer hover:bg-indigo-500"
          onMouseDown={(e) => onConnectorMouseDown(e, node.id, false)}
        />
      )}
    </div>
  );
};

export default memo(NodeComponent);