// src/game.ts

// --- IMPORTS ---
import { log } from 'console';
import { GamePrompts } from './prompts.js';
import type { GameUI } from './ui.js';
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

  /**
   * Constructs a new game instance.
   * @param playerX An object that implements the IAiPlayerService interface for player X.
   * @param playerO An object that implements the IAiPlayerService interface for player O.
   * @param ui An object that implements the GameUI interface for handling output.
   */
  constructor(playerX: IAiPlayerService, playerO: IAiPlayerService, private ui: GameUI) {
    this.players = { X: playerX, O: playerO };
  }

  /**
   * Starts and runs the game loop until a winner is found or a draw occurs.
   */
  public async play() {
    this.ui.onGameStart(this.players['X'], this.players['O']);
    this.ui.onBoardUpdate(this.board, null);

    while (this.gameStatus === 'ongoing') {
      const currentPlayer = this.players[this.currentPlayerSymbol];

      this.handleFrozenCell();
      const payload = this.createApiPayload(currentPlayer);

      // console.log(payload);

      try {
        this.ui.onMoveFunction(currentPlayer);
        const aiResponse = await currentPlayer.getMove(payload);

        // console.log(aiResponse);

        if (this.isValidMove(aiResponse.move)) {
          this.applyMove(aiResponse.move);

          this.ui.onMoveMade(currentPlayer, aiResponse.move, aiResponse.trashTalk);
          this.lastTrashTalk = aiResponse.trashTalk;
        } else {
          this.ui.onInvalidMove(currentPlayer, this.turnNumber);
        }

        this.ui.onBoardUpdate(this.board, this.frozenCell);
        this.updateGameStatus();

        if (this.gameStatus === 'ongoing') {
          this.turnNumber++;
          this.currentPlayerSymbol =
            this.currentPlayerSymbol === 'X' ? 'O' : 'X';
        }
      } catch (error) {
        this.ui.onError(currentPlayer);
        this.gameStatus = 'draw'; // End game on error
      }
    }

    this.announceWinner();
  }

  //  Assembles the complete data payload required by the AI for its turn.

  private createApiPayload(player: IAiPlayerService): ApiInput {
    // console.log(boardString); // Removed debug log or move to UI if needed debug mode

    const boardString = this.board
      .map((row) => row.map((cell) => cell || '.').join('|'))
      .join('\n');

    return {
      context: {
        gameRules: GamePrompts.gameRules,
      },
      gameState: {
        turnNumber: this.turnNumber,
        board: boardString,
        frozenCell: this.frozenCell,
        gameStatus: this.gameStatus,
      },
      instructions: {
        task: GamePrompts.taskInstructions,
        responseFormat: GamePrompts.responseFormat,
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
        
        // Note: Frozen cell update is handled in the main loop's onBoardUpdate
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

  // Displays the final result of the game.

  private announceWinner() {
    if (this.gameStatus === 'ongoing') return; // Should not happen given logic, but satisfies TS

    if (this.gameStatus === 'draw') {
      this.ui.onGameOver('draw');
    } else {
      const winner =
        this.gameStatus === 'X_wins' ? this.players['X'] : this.players['O'];
      this.ui.onGameOver(this.gameStatus, winner);
    }
  }
}
