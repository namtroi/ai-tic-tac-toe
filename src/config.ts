import dotenv from 'dotenv';
import { ChatGptProvider } from './ai-providers/chatGptProvider.js';
import { GeminiProvider } from './ai-providers/geminiProvider.js';
import { DeepseekProvider } from './ai-providers/deepseekProvider.js';
import type { IAiPlayerService, PlayerSymbol } from './types.js';

// Load environment variables
dotenv.config();

export const Config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
};

export type PlayerType = 'gpt3' | 'gpt4' | 'gpt4o' | 'gemini' | 'deepseek';

export function createPlayer(
  type: string,
  symbol: PlayerSymbol
): IAiPlayerService {
  switch (type.toLowerCase()) {
    case 'gpt3':
      validateKey('OPENAI_API_KEY');
      return new ChatGptProvider(symbol, Config.OPENAI_API_KEY!, 'gpt-3.5-turbo');
    case 'gpt4':
      validateKey('OPENAI_API_KEY');
      return new ChatGptProvider(symbol, Config.OPENAI_API_KEY!, 'gpt-4-turbo');
    case 'gpt4o':
      validateKey('OPENAI_API_KEY');
      return new ChatGptProvider(symbol, Config.OPENAI_API_KEY!, 'gpt-4o');
    case 'gemini':
      validateKey('GEMINI_API_KEY');
      return new GeminiProvider(symbol, Config.GEMINI_API_KEY!, 'gemini-pro');
    case 'deepseek':
      validateKey('DEEPSEEK_API_KEY');
      return new DeepseekProvider(symbol, Config.DEEPSEEK_API_KEY!, 'deepseek-chat');
    default:
      throw new Error(
        `Unknown player type: ${type}. Supported: gpt3, gpt4, gpt4o, gemini, deepseek`
      );
  }
}

function validateKey(keyName: keyof typeof Config) {
  if (!Config[keyName]) {
    console.error(`❌ Missing API key: ${keyName} is required for this player type.`);
    process.exit(1);
  }
}
