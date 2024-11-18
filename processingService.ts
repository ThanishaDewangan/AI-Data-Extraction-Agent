import { SearchService } from './searchService';
import { LLMService } from './llmService';
import { SearchResult, ExtractedInformation } from '../types';

export class ProcessingService {
  private searchService: SearchService;
  private llmService: LLMService;

  constructor() {
    this.searchService = new SearchService();
    this.llmService = new LLMService();
  }

  async processEntity(
    entity: string,
    searchPrompt: string,
    extractionPrompt: string
  ): Promise<ExtractedInformation> {
    try {
      const formattedSearchPrompt = searchPrompt.replace('{entity}', entity);
      const searchResults = await this.searchService.search(formattedSearchPrompt);
      
      if (!searchResults.length) {
        return {
          entity,
          information: 'No search results found',
        };
      }

      const formattedResults = searchResults
        .map(result => `Title: ${result.title}\nURL: ${result.link}\nSnippet: ${result.snippet}\n`)
        .join('\n');
      
      const formattedExtractionPrompt = extractionPrompt.replace('{entity}', entity);
      const extractedInfo = await this.llmService.extractInformation(
        formattedResults,
        formattedExtractionPrompt
      );

      return {
        entity,
        information: extractedInfo,
      };
    } catch (error) {
      console.error(`Processing failed for ${entity}:`, error);
      throw error;
    }
  }

  async processEntities(
    entities: string[],
    searchPrompt: string,
    extractionPrompt: string,
    onProgress: (result: SearchResult) => void
  ): Promise<void> {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const batchSize = 3; // Reduced batch size for better reliability
    const batches = [];

    for (let i = 0; i < entities.length; i += batchSize) {
      batches.push(entities.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const promises = batch.map(async (entity) => {
        onProgress({
          entity,
          extractedInfo: '',
          status: 'processing',
        });

        try {
          const result = await this.processEntity(entity, searchPrompt, extractionPrompt);
          onProgress({
            entity,
            extractedInfo: result.information,
            status: 'completed',
          });
        } catch (error) {
          onProgress({
            entity,
            extractedInfo: '',
            status: 'error',
            error: error instanceof Error ? error.message : 'Processing failed',
          });
        }
      });

      await Promise.all(promises);
      await delay(3000); // Increased delay between batches
    }
  }
}