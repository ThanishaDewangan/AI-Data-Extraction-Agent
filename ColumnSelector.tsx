import React from 'react';

interface ColumnSelectorProps {
  columns: string[];
  selectedColumn: string;
  onColumnSelect: (column: string) => void;
}

export function ColumnSelector({ columns, selectedColumn, onColumnSelect }: ColumnSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="column-select" className="block text-sm font-medium text-gray-700">
        Select Primary Column
      </label>
      <select
        id="column-select"
        value={selectedColumn}
        onChange={(e) => onColumnSelect(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Select a column...</option>
        {columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
    </div>
  );
}