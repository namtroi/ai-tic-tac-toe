// src/ai-providers/geminiProvider.ts
import axios from 'axios';
import type {
  ApiInput,
  ApiResponse,
  IAiPlayerService,
  PlayerSymbol,
  GeminiApiResponse,
} from '../types.js';

// Gemini requires a slightly different prompt structure.
const API_PROMPT_TEMPLATE = `You are a pro gamer named Gemini. Your task is to analyze the provided JSON data about a Tic-Tac-Toe game. You must respond with only a valid JSON object representing your move.`;

export class GeminiProvider implements IAiPlayerService {
  public name: string = 'Gemini';
  public symbol: PlayerSymbol;
  private apiKey: string;
  private apiUrl: string;

  constructor(
    symbol: PlayerSymbol,
    apiKey: string,
    modelName: string = 'gemini-1.0-pro'
  ) {
    if (!apiKey) throw new Error('Gemini API key is required.');
    this.symbol = symbol;
    this.apiKey = apiKey;
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;
  }

  async getMove(payload: ApiInput): Promise<ApiResponse> {
    const fullPrompt = `${API_PROMPT_TEMPLATE}\n${JSON.stringify(
      payload,
      null,
      2
    )}`;

    // Gemini has a different request body structure
    const requestData = {
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json', // Instruct Gemini to output JSON
      },
    };

    try {
      const response = await axios.post<GeminiApiResponse>(
        this.apiUrl,
        requestData
      );
      // And a different response body structure

      const content = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(content);
    } catch (error: any) {
      console.error(
        `Error getting move from ${this.name}:`,
        error.response?.data || error.message
      );
      throw new Error('Gemini failed to respond.');
    }
  }
}
