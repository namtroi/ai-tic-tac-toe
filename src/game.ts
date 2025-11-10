// src/game.ts

// --- IMPORTS ---
import { log } from 'console';
import type {
  ApiInput,
  Board,
  IAiPlayerService,
  Move,
  PlayerSymbol,
} from './types.js';

/**
 * The Game class orchestrates the entire Tic-Tac-Toe match.
 * It manages the board state, player turns, and game rules,
 * but delegates the move-making logic to the AI player services.
 */
export class Game {
  // --- PRIVATE PROPERTIES ---
  private board: Board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  private turnNumber: number = 1;
  private players: { X: IAiPlayerService; O: IAiPlayerService };
  private currentPlayerSymbol: PlayerSymbol = 'X'; // X always goes first
  private frozenCell: Move | null = null;
  private lastTrashTalk: string | null = null;
  private gameStatus: 'ongoing' | 'X_wins' | 'O_wins' | 'draw' = 'ongoing';

  /**
   * Constructs a new game instance.
   * @param playerX An object that implements the IAiPlayerService interface for player X.
   * @param playerO An object that implements the IAiPlayerService interface for player O.
   */
  constructor(playerX: IAiPlayerService, playerO: IAiPlayerService) {
    this.players = { X: playerX, O: playerO };
  }

  /**
   * Starts and runs the game loop until a winner is found or a draw occurs.
   */
  public async play() {
    console.log(
      `--- 🚀 GAME START: ${this.players['X'].name} (X) vs. ${this.players['O'].name} (O) ---`
    );
    this.printBoard(null);

    while (this.gameStatus === 'ongoing') {
      const currentPlayer = this.players[this.currentPlayerSymbol];

      this.handleFrozenCell();
      const payload = this.createApiPayload(currentPlayer);

      // console.log(payload);

      try {
        console.log(
          `\n ----------🤔 Asking ${currentPlayer.name} for a move ----------`
        );
        const aiResponse = await currentPlayer.getMove(payload);

        // console.log(aiResponse);

        if (this.isValidMove(aiResponse.move)) {
          this.applyMove(aiResponse.move);

          console.log(`${currentPlayer.name} 🎤 ${aiResponse.trashTalk}`);
          this.lastTrashTalk = aiResponse.trashTalk;
        } else {
          console.warn(
            `[Turn ${this.turnNumber}] ⚠️ ${currentPlayer.name} made an invalid move! Skipping turn.`
          );
        }

        this.printBoard(null);
        this.updateGameStatus();

        if (this.gameStatus === 'ongoing') {
          this.turnNumber++;
          this.currentPlayerSymbol =
            this.currentPlayerSymbol === 'X' ? 'O' : 'X';
        }
      } catch (error) {
        console.error(
          `❌ Game cannot continue due to an API error from ${currentPlayer.name}.`
        );
        this.gameStatus = 'draw'; // End game on error
      }
    }

    this.announceWinner();
  }

  //  Assembles the complete data payload required by the AI for its turn.

  private createApiPayload(player: IAiPlayerService): ApiInput {
    const opponent =
      this.currentPlayerSymbol === 'X' ? this.players['O'] : this.players['X'];

    const boardString = this.board
      .map((row) => row.map((cell) => cell || '.').join('|'))
      .join('\n');

    console.log(boardString);

    return {
      context: {
        gameRules:
          "3x3 Tic-Tac-Toe. Win with 3 in a row (any direction). X goes first. On turns 1-7, there's a 33% chance a random empty cell gets frozen for the turn. You can't play on a frozen cell. No freezing on turns 8-9.",
        // yourPersona: {
        //   symbol: player.symbol,
        //   name: player.name,
        //   personality:
        //     "A cocky, sharp-witted pro gamer. You love to get in your opponent's head with clever taunts and psychological jabs.",
        // },
        // opponent: {
        //   name: opponent.name,
        //   // lastTrashTalk: this.lastTrashTalk,
        // },
      },
      gameState: {
        turnNumber: this.turnNumber,
        board: boardString,
        frozenCell: this.frozenCell,
        gameStatus: this.gameStatus,
      },
      instructions: {
        task:
          "Analyze the `gameState.board`. The board is a multi-line string where '.' represents an empty cell. " +
          'You MUST follow this priority: ' +
          '1. Find a move that wins the game. ' +
          "2. If no winning move, find a move that BLOCKS your opponent's winning move. " +
          '3. If neither, find the best strategic move. ' +
          '4. You cannot play in the `frozenCell`.',
        responseFormat:
          "You must respond with a valid JSON object. The JSON must contain these exact keys: 'move' (an object with 'row' and 'col' keys).",
      },
    };
  }

  // Implements the 33% chance to freeze a random empty cell on turns 1-7.

  private handleFrozenCell() {
    this.frozenCell = null; // Unfreeze cell from the previous turn.
    if (this.turnNumber <= 7 && Math.random() < 0.33) {
      const emptyCells: Move[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (this.board[r]![c] === null) {
            emptyCells.push({ row: r, col: c });
          }
        }
      }
      if (emptyCells.length > 0) {
        this.frozenCell =
          emptyCells[Math.floor(Math.random() * emptyCells.length)]!;

        this.printBoard(this.frozenCell);
      }
    }
  }

  //  Validates if a move from an AI is legal.

  private isValidMove(move: Move): boolean {
    if (!move || move.row < 0 || move.row > 2 || move.col < 0 || move.col > 2) {
      return false;
    }
    if (
      this.frozenCell &&
      this.frozenCell.row === move.row &&
      this.frozenCell.col === move.col
    ) {
      return false;
    }
    return this.board[move.row]![move.col] === null;
  }

  private applyMove(move: Move) {
    this.board[move.row]![move.col] = this.currentPlayerSymbol;
  }

  private updateGameStatus() {
    const lines = [
      [this.board[0][0], this.board[0][1], this.board[0][2]],
      [this.board[1][0], this.board[1][1], this.board[1][2]],
      [this.board[2][0], this.board[2][1], this.board[2][2]],
      [this.board[0][0], this.board[1][0], this.board[2][0]],
      [this.board[0][1], this.board[1][1], this.board[2][1]],
      [this.board[0][2], this.board[1][2], this.board[2][2]],
      [this.board[0][0], this.board[1][1], this.board[2][2]],
      [this.board[0][2], this.board[1][1], this.board[2][0]],
    ];

    for (const line of lines) {
      if (line[0] && line[0] === line[1] && line[1] === line[2]) {
        this.gameStatus = line[0] === 'X' ? 'X_wins' : 'O_wins';
        return;
      }
    }

    if (!this.board.flat().includes(null)) {
      this.gameStatus = 'draw';
    }
  }

  // Prints the current state of the board to the console.

  private printBoard(frozenCell: Move | null) {
    console.log('\nCurrent Board:');

    this.board.forEach((row, r) => {
      const rowString = row
        .map((cellValue, c) => {
          if (frozenCell && frozenCell.row === r && frozenCell.col === c) {
            return '❄️';
          }
          return cellValue || ' ';
        })
        .join(' | ');

      console.log(`  ${rowString}`);
    });
  }

  // Displays the final result of the game.

  private announceWinner() {
    console.log('\n--- 🏁 GAME OVER ---');
    if (this.gameStatus === 'draw') {
      console.log("It's a draw! Well played by both sides.");
    } else {
      const winner =
        this.gameStatus === 'X_wins' ? this.players['X'] : this.players['O'];
      console.log(`🏆 Winner is: ${winner.name} (${winner.symbol})!`);
    }
  }
}
