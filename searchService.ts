import { getJson } from 'serpapi';

const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY;

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export class SearchService {
  private rateLimitDelay = 1000;
  private lastRequestTime = 0;
  private maxRetries = 3;

  private async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  private async searchWithRetry(query: string, retryCount = 0): Promise<SearchResult[]> {
    try {
      await this.enforceRateLimit();

      if (!SERPAPI_KEY) {
        throw new Error('SERPAPI_KEY is not configured');
      }

      const response = await getJson({
        api_key: SERPAPI_KEY,
        engine: 'google',
        q: query,
        num: 5,
        gl: 'us',
        hl: 'en',
      });

      if (!response?.organic_results?.length) {
        throw new Error('No search results found');
      }

      return response.organic_results.map((result: any) => ({
        title: result.title || '',
        link: result.link || '',
        snippet: result.snippet || '',
      }));
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return this.searchWithRetry(query, retryCount + 1);
      }
      throw error;
    }
  }

  async search(query: string): Promise<SearchResult[]> {
    try {
      return await this.searchWithRetry(query);
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Search failed');
    }
  }
}