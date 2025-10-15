export enum NodeType {
  START = 'START',
  TEXT_INPUT = 'TEXT_INPUT',
  GEMINI_PROMPT = 'GEMINI_PROMPT',
  WEB_SCRAPER = 'WEB_SCRAPER',
  PLAYWRIGHT = 'PLAYWRIGHT',
  OUTPUT = 'OUTPUT',
}

export enum NodeExecutionStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface NodeData {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    value: string; // For input nodes, this is the user-input. For others, it's the result.
    status: NodeExecutionStatus;
    error?: string;
  };
}

export interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
}
