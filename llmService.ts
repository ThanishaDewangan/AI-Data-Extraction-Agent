import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export class LLMService {
  private openai: OpenAI;
  private maxRetries = 3;
  private systemPrompt = `You are a helpful assistant that extracts specific information from web search results. 
Your task is to:
1. Analyze the provided search results carefully
2. Extract the requested information based on the given prompt
3. Format the response in a clear, concise manner
4. If the information is not found, respond with "Information not found"
5. Always maintain factual accuracy and avoid making assumptions`;

  constructor() {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    this.openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  private async extractWithRetry(searchResults: string, prompt: string, retryCount = 0): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.systemPrompt,
          },
          {
            role: 'user',
            content: `Given the following search results:\n\n${searchResults}\n\nPlease ${prompt}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });

      return response.choices[0]?.message?.content || 'No information found';
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return this.extractWithRetry(searchResults, prompt, retryCount + 1);
      }
      throw error;
    }
  }

  async extractInformation(searchResults: string, prompt: string): Promise<string> {
    try {
      return await this.extractWithRetry(searchResults, prompt);
    } catch (error) {
      console.error('LLM processing failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to process information');
    }
  }
}