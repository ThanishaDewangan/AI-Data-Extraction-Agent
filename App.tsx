import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { GoogleSheetsInput } from './components/GoogleSheetsInput';
import { ColumnSelector } from './components/ColumnSelector';
import { QueryInput } from './components/QueryInput';
import { ResultsTable } from './components/ResultsTable';
import { ProcessedData, SearchResult } from './types';
import { ProcessingService } from './services/processingService';
import { Bot } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [extractionPrompt, setExtractionPrompt] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataSource, setDataSource] = useState<'file' | 'sheets' | null>(null);

  const handleDataProcessed = (processedData: ProcessedData) => {
    setData(processedData);
    toast.success('Data loaded successfully!');
  };

  const handleProcess = async () => {
    if (!data || !selectedColumn || !searchQuery || !extractionPrompt) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    const processingService = new ProcessingService();
    const entities = data.rows.map(row => row[selectedColumn]);

    try {
      // Initialize results
      setResults(
        entities.map(entity => ({
          entity,
          extractedInfo: '',
          status: 'pending',
        }))
      );

      // Process entities and update results
      await processingService.processEntities(
        entities,
        searchQuery,
        extractionPrompt,
        (result) => {
          setResults(prev =>
            prev.map(r =>
              r.entity === result.entity ? result : r
            )
          );
        }
      );

      toast.success('Processing completed!');
    } catch (error) {
      toast.error('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const csv = [
      ['Entity', 'Extracted Information', 'Status'],
      ...results.map(r => [r.entity, r.extractedInfo, r.status])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Bot className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">AI Data Extraction Agent</h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload your data, define your search query, and let AI do the work
          </p>
        </div>

        <div className="space-y-8">
          {!data && !dataSource && (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Upload CSV File</h2>
                <FileUpload onDataProcessed={(data) => {
                  setDataSource('file');
                  handleDataProcessed(data);
                }} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Connect Google Sheets</h2>
                <GoogleSheetsInput onDataProcessed={(data) => {
                  setDataSource('sheets');
                  handleDataProcessed(data);
                }} />
              </div>
            </div>
          )}

          {data && (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <ColumnSelector
                    columns={data.columns}
                    selectedColumn={selectedColumn}
                    onColumnSelect={setSelectedColumn}
                  />
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <QueryInput
                    query={searchQuery}
                    extractionPrompt={extractionPrompt}
                    onQueryChange={setSearchQuery}
                    onExtractionPromptChange={setExtractionPrompt}
                    onSubmit={handleProcess}
                    isProcessing={isProcessing}
                  />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <ResultsTable results={results} onDownload={handleDownload} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;