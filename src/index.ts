// src/index.ts
import dotenv from 'dotenv';
import { Game } from './game.js';
import type { IAiPlayerService } from './types.js';

// Import the specific AI provider classes you want to use
import { ChatGptProvider } from './ai-providers/chatGptProvider.js';
import { GeminiProvider } from './ai-providers/geminiProvider.js';
import { DeepseekProvider } from './ai-providers/deepseekProvider.js';

// Load environment variables from .env file
dotenv.config();

function main() {
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  if (!openAiKey || !geminiKey || !deepseekKey) {
    console.error(
      'Missing API keys in .env file. You need OPENAI_API_KEY, GEMINI_API_KEY, and DEEPSEEK_API_KEY.'
    );
    process.exit(1);
  }

  // --- Assemble the Players ---
  // You can now choose any two AIs to fight!

  const player1: IAiPlayerService = new ChatGptProvider(
    'X',
    openAiKey!,
    'gpt-3.5-turbo'
  );
  const player2: IAiPlayerService = new DeepseekProvider(
    'O',
    deepseekKey!,
    'deepseek-chat'
  );

  // const player1: IAiPlayerService = new ChatGptProvider('X', openAiKey!, 'gpt-4o');
  // const player2: IAiPlayerService = new DeepseekProvider('O', deepseekKey!, 'deepseek-chat');

  // --- Start the Game ---
  const game = new Game(player1, player2);
  game.play();
}

main();
