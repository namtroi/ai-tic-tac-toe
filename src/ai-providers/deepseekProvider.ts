// src/ai-providers/deepseekProvider.ts
import axios from 'axios';
import type {
  ApiInput,
  ApiResponse,
  IAiPlayerService,
  PlayerSymbol,
  OpenAiApiResponse, // We can reuse this type as Deepseek's response is similar
} from '../types.js';
import { cleanAiResponse } from '../utils.js';

const API_PROMPT_TEMPLATE = `You are a pro gamer named Deepseek. Your response MUST be a single, valid JSON object and nothing else. Analyze the following game data and provide your move.`;

export class DeepseekProvider implements IAiPlayerService {
  public name: string = 'Deepseek';
  public symbol: PlayerSymbol;
  private apiKey: string;
  private apiUrl: string = 'https://api.deepseek.com/chat/completions';
  private modelName: string;

  constructor(
    symbol: PlayerSymbol,
    apiKey: string,
    modelName: string = 'deepseek-chat'
  ) {
    if (!apiKey) throw new Error('Deepseek API key is required.');
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

    // The request data is very similar to OpenAI's
    const requestData = {
      model: this.modelName,
      messages: [{ role: 'user', content: fullPrompt }],
    };

    try {
      // Note: Deepseek might not support the JSON object response format,
      // so we rely on the prompt to return valid JSON.
      const response = await axios.post<OpenAiApiResponse>(
        this.apiUrl,
        requestData,
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      );
      const content = response.data.choices[0].message.content;

      const cleanContent = cleanAiResponse(content);

      // console.log(cleanContent);

      return JSON.parse(cleanContent);
    } catch (error: any) {
      console.error(
        `Error getting move from ${this.name}:`,
        error.response?.data || error.message
      );
      throw new Error('Deepseek failed to respond.');
    }
  }
}
