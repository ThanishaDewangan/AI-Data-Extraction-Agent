export interface DataRow {
  [key: string]: string;
}

export interface ProcessedData {
  columns: string[];
  rows: DataRow[];
}

export interface SearchResult {
  entity: string;
  extractedInfo: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  searchResults?: {
    title: string;
    link: string;
    snippet: string;
  }[];
}

export interface ExtractedInformation {
  entity: string;
  information: string;
}