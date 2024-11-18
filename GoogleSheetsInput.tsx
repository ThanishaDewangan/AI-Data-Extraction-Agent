import React, { useState } from 'react';
import { Table } from 'lucide-react';
import { ProcessedData } from '../types';
import { GoogleSheetsService } from '../services/googleSheets';
import toast from 'react-hot-toast';

interface GoogleSheetsInputProps {
  onDataProcessed: (data: ProcessedData) => void;
}

export function GoogleSheetsInput({ onDataProcessed }: GoogleSheetsInputProps) {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [range, setRange] = useState('A1:Z1000');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const service = new GoogleSheetsService();
      
      await service.initialize();
      await service.authenticate();
      const data = await service.getSheetData(spreadsheetId, range);
      onDataProcessed(data);
      toast.success('Successfully connected to Google Sheets!');
    } catch (error) {
      console.error('Failed to connect to Google Sheets:', error);
      toast.error('Failed to connect to Google Sheets. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="spreadsheet-id" className="block text-sm font-medium text-gray-700">
          Spreadsheet ID
        </label>
        <input
          id="spreadsheet-id"
          type="text"
          value={spreadsheetId}
          onChange={(e) => setSpreadsheetId(e.target.value)}
          placeholder="Enter spreadsheet ID from URL"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500">
          Find this in your Google Sheets URL: /spreadsheets/d/[SPREADSHEET-ID]/edit
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="range" className="block text-sm font-medium text-gray-700">
          Range
        </label>
        <input
          id="range"
          type="text"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          placeholder="e.g., Sheet1!A1:Z1000"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleConnect}
        disabled={isConnecting || !spreadsheetId}
        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
          ${isConnecting || !spreadsheetId
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
      >
        <Table className="w-5 h-5 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect to Google Sheets'}
      </button>
    </div>
  );
}