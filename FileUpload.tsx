import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { ProcessedData } from '../types';

interface FileUploadProps {
  onDataProcessed: (data: ProcessedData) => void;
}

export function FileUpload({ onDataProcessed }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const columns = results.data[0] as string[];
          const rows = results.data.slice(1).map((row) => {
            const rowData: { [key: string]: string } = {};
            columns.forEach((col, index) => {
              rowData[col] = row[index] as string;
            });
            return rowData;
          });
          onDataProcessed({ columns, rows });
        },
        header: false,
      });
    }
  }, [onDataProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-gray-600">
        <Upload className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
        </p>
        <p className="text-sm text-gray-500">or click to select a file</p>
      </div>
    </div>
  );
}