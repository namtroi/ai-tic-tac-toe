// src/index.ts
import { Command } from 'commander';
import { Game } from './game.js';
import { ConsoleUI } from './ui.js';
import { createPlayer } from './config.js';

const program = new Command();

program
  .name('ai-tic-tac-toe')
  .description('AI Battle Arena for Tic-Tac-Toe')
  .version('1.0.0')
  .option('--p1 <type>', 'Player 1 type (gpt3, gpt4, gpt4o, gemini, deepseek)', 'gpt4o')
  .option('--p2 <type>', 'Player 2 type (gpt3, gpt4, gpt4o, gemini, deepseek)', 'deepseek')
  .parse(process.argv);

const options = program.opts();

function main() {
  try {
    console.log(`Setting up match: ${options.p1} (X) vs ${options.p2} (O)`);

    const player1 = createPlayer(options.p1, 'X');
    const player2 = createPlayer(options.p2, 'O');

    // --- Start the Game ---
    const ui = new ConsoleUI();
    const game = new Game(player1, player2, ui);
    game.play();
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
