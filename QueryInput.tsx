import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface QueryInputProps {
  query: string;
  extractionPrompt: string;
  onQueryChange: (query: string) => void;
  onExtractionPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export function QueryInput({
  query,
  extractionPrompt,
  onQueryChange,
  onExtractionPromptChange,
  onSubmit,
  isProcessing,
}: QueryInputProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="search-query" className="block text-sm font-medium text-gray-700">
          Search Query Template
        </label>
        <div className="relative">
          <input
            id="search-query"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Find information about {entity}"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-4 pr-12"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Use {'{entity}'} as a placeholder for each item in your selected column
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="extraction-prompt" className="block text-sm font-medium text-gray-700">
          Information Extraction Prompt
        </label>
        <textarea
          id="extraction-prompt"
          value={extractionPrompt}
          onChange={(e) => onExtractionPromptChange(e.target.value)}
          placeholder="Extract the following information about {entity}..."
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500">
          Specify what information you want to extract from the search results
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={isProcessing || !query.trim() || !extractionPrompt.trim()}
        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
          ${
            isProcessing || !query.trim() || !extractionPrompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
      >
        {isProcessing ? 'Processing...' : 'Start Processing'}
      </button>
    </div>
  );
}