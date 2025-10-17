// src/ai-providers/chatGptProvider.ts
import axios from 'axios';
import type {
  ApiInput,
  ApiResponse,
  IAiPlayerService,
  PlayerSymbol,
  OpenAiApiResponse,
} from '../types.js';
import { cleanAiResponse } from '../utils.js';

const API_PROMPT_TEMPLATE = `You are a pro gamer named ChatGPT. Your response MUST be a single, valid JSON object and nothing else. Analyze the following game data and provide your move.`;

export class ChatGptProvider implements IAiPlayerService {
  public name: string = 'ChatGPT';
  public symbol: PlayerSymbol;
  private apiKey: string;
  private apiUrl: string = 'https://api.openai.com/v1/chat/completions';
  private modelName: string;

  constructor(
    symbol: PlayerSymbol,
    apiKey: string,
    modelName: string = 'gpt-3.5-turbo'
  ) {
    if (!apiKey) throw new Error('ChatGPT API key is required.');
    this.symbol = symbol;
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async getMove(payload: ApiInput): Promise<ApiResponse> {
    const fullPrompt = `${API_PROMPT_TEMPLATE}\n${JSON.stringify(
      payload,
      null,
      2
    )}`;

    const requestData = {
      model: this.modelName,
      messages: [{ role: 'user', content: fullPrompt }],
      response_format: { type: 'json_object' },
    };

    try {
      const response = await axios.post<OpenAiApiResponse>(
        this.apiUrl,
        requestData,
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      );
      const content = response.data.choices[0].message.content;

      const cleanContent = cleanAiResponse(content);

      return JSON.parse(cleanContent);
    } catch (error: any) {
      console.error(
        `Error getting move from ${this.name}:`,
        error.response?.data || error.message
      );
      throw new Error('ChatGPT failed to respond.');
    }
  }
}
