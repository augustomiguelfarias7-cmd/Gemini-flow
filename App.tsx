import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WorkflowCanvas from './components/WorkflowCanvas';
import { NodeData, Edge, NodeType, NodeExecutionStatus } from './types';
import { runGemini } from './services/geminiService';
import { scrapeUrl } from './services/scraperService';
import { runPlaywright } from './services/playwrightService';

const initialNodes: NodeData[] = [
  {
    id: 'start-1',
    type: NodeType.START,
    position: { x: 50, y: 150 },
    data: { label: 'Start', value: 'Workflow Start', status: NodeExecutionStatus.IDLE },
  },
  {
    id: 'output-1',
    type: NodeType.OUTPUT,
    position: { x: 850, y: 150 },
    data: { label: 'Output', value: '', status: NodeExecutionStatus.IDLE },
  },
];

const App: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addNode = useCallback((type: NodeType) => {
    const newNode: NodeData = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      position: { x: 250, y: 150 + Math.random() * 100 },
      data: { label: type, value: '', status: NodeExecutionStatus.IDLE },
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const resetWorkflow = useCallback(() => {
    setNodes(initialNodes);
    setEdges([]);
    setIsRunning(false);
  }, []);

  const runWorkflow = useCallback(async () => {
    setIsRunning(true);

    let executionNodes = nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        status: NodeExecutionStatus.IDLE,
        value: n.type === NodeType.OUTPUT ? '' : n.data.value,
        error: ''
      }
    }));
    setNodes(executionNodes);
    
    const edgeMap = new Map(edges.map(edge => [edge.targetId, edge.sourceId]));

    const executionQueue: string[] = executionNodes.filter(n => n.type === NodeType.START).map(n => n.id);
    const executedNodes = new Set<string>();

    while (executionQueue.length > 0) {
      const currentNodeId = executionQueue.shift();
      if (!currentNodeId || executedNodes.has(currentNodeId)) continue;
      
      const nodeIndex = executionNodes.findIndex(n => n.id === currentNodeId);
      if (nodeIndex === -1) continue;
      let node = executionNodes[nodeIndex];

      try {
        node = { ...node, data: { ...node.data, status: NodeExecutionStatus.RUNNING }};
        executionNodes[nodeIndex] = node;
        setNodes([...executionNodes]);

        let outputValue = '';
        const sourceId = edgeMap.get(currentNodeId);
        const sourceNode = sourceId ? executionNodes.find(n => n.id === sourceId) : undefined;

        if (sourceId && (!sourceNode || sourceNode.data.status !== NodeExecutionStatus.SUCCESS)) {
            // This check might be too strict if some nodes start simultaneously.
            // For a simple linear flow, it's okay.
            const sourceNodeFromInitial = nodes.find(n => n.id === sourceId);
            if(sourceNodeFromInitial?.type !== NodeType.START) {
              await new Promise(resolve => setTimeout(resolve, 50)); // give a moment for state to propagate
              const freshSourceNode = executionNodes.find(n => n.id === sourceId);
              if (!freshSourceNode || freshSourceNode.data.status !== NodeExecutionStatus.SUCCESS) {
                  throw new Error("Input node has not run successfully.");
              }
            }
        }


        switch (node.type) {
          case NodeType.START:
            outputValue = "Workflow initiated";
            break;
          case NodeType.TEXT_INPUT:
            outputValue = node.data.value;
            break;
          case NodeType.GEMINI_PROMPT:
            if (!sourceNode) throw new Error("Gemini node has no input.");
            outputValue = await runGemini(sourceNode.data.value);
            break;
          case NodeType.WEB_SCRAPER:
            if (!sourceNode) throw new Error("Web Scraper node has no input URL.");
            outputValue = await scrapeUrl(sourceNode.data.value);
            break;
          case NodeType.PLAYWRIGHT:
            const playwrightInput = sourceNode ? sourceNode.data.value : node.data.value;
            if (!playwrightInput) throw new Error("Playwright node requires a JSON configuration from its input or its text area.");
            outputValue = await runPlaywright(playwrightInput);
            break;
          case NodeType.OUTPUT:
             if (sourceNode) {
                const updatedNode = { ...node, data: { ...node.data, value: sourceNode.data.value }};
                executionNodes[nodeIndex] = updatedNode;
                setNodes([...executionNodes]);
                outputValue = updatedNode.data.value;
             } else {
               outputValue = node.data.value;
             }
             break;
        }

        const finalNode = { ...executionNodes[nodeIndex], data: { ...executionNodes[nodeIndex].data, value: outputValue, status: NodeExecutionStatus.SUCCESS }};
        executionNodes[nodeIndex] = finalNode;
        setNodes([...executionNodes]);

        executedNodes.add(currentNodeId);

        edges.forEach(edge => {
          if (edge.sourceId === currentNodeId) {
            executionQueue.push(edge.targetId);
          }
        });

      } catch (e: any) {
        const errorNodeIndex = executionNodes.findIndex(n => n.id === currentNodeId);
        if (errorNodeIndex !== -1) {
          executionNodes[errorNodeIndex] = { ...executionNodes[errorNodeIndex], data: { ...executionNodes[errorNodeIndex].data, status: NodeExecutionStatus.ERROR, error: e.message }};
          setNodes([...executionNodes]);
        }
        setIsRunning(false);
        return; 
      }
    }

    setIsRunning(false);
  }, [nodes, edges]);

  return (
    <div className="h-screen w-screen bg-gray-900 text-white font-sans">
      <Header onRun={runWorkflow} onReset={resetWorkflow} isRunning={isRunning} />
      <main className="h-full">
        <Sidebar onAddNode={addNode} />
        <WorkflowCanvas nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
      </main>
    </div>
  );
};

export default App;