
import React, { useState, useCallback, useRef } from 'react';
import { NodeData, Edge } from '../types';
import NodeComponent from './Node';

interface WorkflowCanvasProps {
  nodes: NodeData[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ nodes, edges, setNodes, setEdges }) => {
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<{ sourceId: string; startPos: { x: number; y: number } } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDraggingNode(nodeId);
      setOffset({
        x: e.clientX - node.position.x,
        y: e.clientY - node.position.y,
      });
    }
  }, [nodes]);

  const handleConnectorMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, nodeId: string, isInput: boolean) => {
    e.stopPropagation();
    if (isInput) return; // For simplicity, only allow drawing from output to input
    
    const node = nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
        const rect = e.currentTarget.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();

        setConnecting({
            sourceId: nodeId,
            startPos: {
                x: rect.left - canvasRect.left + rect.width / 2,
                y: rect.top - canvasRect.top + rect.height / 2,
            }
        });
    }
  }, [nodes]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (draggingNode) {
      setNodes(prevNodes =>
        prevNodes.map(n =>
          n.id === draggingNode
            ? { ...n, position: { x: e.clientX - offset.x, y: e.clientY - offset.y } }
            : n
        )
      );
    }
  }, [draggingNode, offset, setNodes]);
  
  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
    setConnecting(null);
  }, []);

  const handleConnectorMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>, nodeId: string, isInput: boolean) => {
     e.stopPropagation();
     if(connecting && isInput) {
        const targetNode = nodes.find(n => n.id === nodeId);
        if(targetNode && connecting.sourceId !== targetNode.id){
            // Prevent connecting to self and duplicate connections
            const edgeExists = edges.some(edge => edge.sourceId === connecting.sourceId && edge.targetId === targetNode.id);
            // Prevent a node from having multiple inputs
            const targetHasInput = edges.some(edge => edge.targetId === targetNode.id);
            
            if(!edgeExists && !targetHasInput) {
                const newEdge: Edge = {
                    id: `edge-${connecting.sourceId}-${targetNode.id}`,
                    sourceId: connecting.sourceId,
                    targetId: targetNode.id
                };
                setEdges(prev => [...prev, newEdge]);
            }
        }
     }
     setConnecting(null);
  }, [connecting, nodes, edges, setEdges]);
  
  const getNodeConnectorPosition = (nodeId: string, isInput: boolean) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    const nodeEl = document.getElementById(nodeId);
    const nodeWidth = 288; // w-72
    const nodeHeight = nodeEl ? nodeEl.offsetHeight : 140; // Use actual height with a fallback

    const x = node.position.x + (isInput ? 0 : nodeWidth);
    const y = node.position.y + nodeHeight / 2;
    
    return { x, y };
  };

  return (
    <div
      ref={canvasRef}
      className="absolute top-0 left-0 right-0 bottom-0 pt-20 pl-64 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        <style>{`.bg-dots { background-image: radial-gradient(#4a5568 1px, transparent 0); background-size: 20px 20px; }`}</style>
      
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {edges.map(edge => {
            const sourcePos = getNodeConnectorPosition(edge.sourceId, false);
            const targetPos = getNodeConnectorPosition(edge.targetId, true);
            const d = `M${sourcePos.x},${sourcePos.y} C${sourcePos.x + 75},${sourcePos.y} ${targetPos.x - 75},${targetPos.y} ${targetPos.x},${targetPos.y}`;
            return <path key={edge.id} d={d} stroke="#6b7280" strokeWidth="2" fill="none" />;
        })}
        {connecting && (
            <path d={`M${connecting.startPos.x},${connecting.startPos.y} L${mousePos.x},${mousePos.y}`} stroke="#a78bfa" strokeWidth="2" fill="none" />
        )}
      </svg>
      
      {nodes.map(node => (
        <NodeComponent
          key={node.id}
          node={node}
          onMouseDown={handleNodeMouseDown}
          onConnectorMouseDown={handleConnectorMouseDown}
          onConnectorMouseUp={handleConnectorMouseUp}
          onValueChange={(nodeId, value) => {
              setNodes(currentNodes => currentNodes.map(n => n.id === nodeId ? {...n, data: {...n.data, value}} : n));
          }}
        />
      ))}
    </div>
  );
};

export default WorkflowCanvas;