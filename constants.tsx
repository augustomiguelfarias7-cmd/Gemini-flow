import React from 'react';
import { NodeType } from './types';

export const NODE_CONFIG = {
  [NodeType.START]: {
    label: 'Start',
    description: 'The starting point of the workflow.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    hasInput: false,
    hasOutput: true,
  },
  [NodeType.TEXT_INPUT]: {
    label: 'Text Input',
    description: 'Provides a text value.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    hasInput: false,
    hasOutput: true,
  },
    [NodeType.PLAYWRIGHT]: {
    label: 'Playwright',
    description: 'Extracts structured data from a URL using a real browser automation service.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1-5h3.5L12 15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15L15 18 17 20 19 18 19 15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4V2M12 9V7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 01-5-5 5 5 0 0110 0 5 5 0 01-5 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v5" />
      </svg>
    ),
    hasInput: true,
    hasOutput: true,
  },
  [NodeType.GEMINI_PROMPT]: {
    label: 'Gemini Prompt',
    description: 'Sends a prompt to the Gemini API.',
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456L18 13.5z"/>
       </svg>
    ),
    hasInput: true,
    hasOutput: true,
  },
  [NodeType.WEB_SCRAPER]: {
    label: 'Web Scraper',
    description: 'Fetches the text content from a URL.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9h18" />
      </svg>
    ),
    hasInput: true,
    hasOutput: true,
  },
  [NodeType.OUTPUT]: {
    label: 'Output',
    description: 'Displays the final result.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
      </svg>
    ),
    hasInput: true,
    hasOutput: false,
  },
};