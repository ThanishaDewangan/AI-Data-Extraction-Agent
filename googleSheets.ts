import { ProcessedData } from '../types';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export class GoogleSheetsService {
  private accessToken: string | null = null;

  async initialize() {
    // Load the Google API client library
    await this.loadGoogleAPI();
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client:auth2', async () => {
          try {
            await gapi.client.init({
              apiKey: GOOGLE_API_KEY,
              clientId: GOOGLE_CLIENT_ID,
              scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
              discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.body.appendChild(script);
    });
  }

  async authenticate(): Promise<void> {
    try {
      const googleAuth = gapi.auth2.getAuthInstance();
      const user = await googleAuth.signIn();
      this.accessToken = user.getAuthResponse().access_token;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  async getSheetData(spreadsheetId: string, range: string): Promise<ProcessedData> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const values = response.result.values;
      if (!values || values.length === 0) {
        throw new Error('No data found in sheet');
      }

      const columns = values[0] as string[];
      const rows = values.slice(1).map(row => {
        const rowData: { [key: string]: string } = {};
        columns.forEach((col, index) => {
          rowData[col] = row[index] as string || '';
        });
        return rowData;
      });

      return { columns, rows };
    } catch (error) {
      console.error('Failed to fetch sheet data:', error);
      throw new Error('Failed to fetch sheet data');
    }
  }
}