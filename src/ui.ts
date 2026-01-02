import type { Board, IAiPlayerService, Move, PlayerSymbol } from './types.js';

export interface GameUI {
  onGameStart(playerX: IAiPlayerService, playerO: IAiPlayerService): void;
  onTurnStart(player: IAiPlayerService, turnNumber: number): void;
  onBoardUpdate(board: Board, frozenCell: Move | null): void;
  onMoveFunction(player: IAiPlayerService): void;
  onMoveMade(player: IAiPlayerService, move: Move, trashTalk: string): void;
  onInvalidMove(player: IAiPlayerService, turnNumber: number): void;
  onError(player: IAiPlayerService): void;
  onGameOver(status: 'X_wins' | 'O_wins' | 'draw', winner?: IAiPlayerService): void;
}

export class ConsoleUI implements GameUI {
  onGameStart(playerX: IAiPlayerService, playerO: IAiPlayerService): void {
    console.log(
      `--- 🚀 GAME START: ${playerX.name} (X) vs. ${playerO.name} (O) ---`
    );
  }

  onTurnStart(player: IAiPlayerService, turnNumber: number): void {
    // Optional: Could log turn start, but keeping it minimal as per original
  }

  onBoardUpdate(board: Board, frozenCell: Move | null): void {
    console.log('\nCurrent Board:');
    board.forEach((row, r) => {
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

  onMoveFunction(player: IAiPlayerService): void {
    console.log(
      `\n ----------🤔 Asking ${player.name} for a move ----------`
    );
  }

  onMoveMade(player: IAiPlayerService, move: Move, trashTalk: string): void {
    console.log(`${player.name} 🎤 ${trashTalk}`);
  }

  onInvalidMove(player: IAiPlayerService, turnNumber: number): void {
    console.warn(
      `[Turn ${turnNumber}] ⚠️ ${player.name} made an invalid move! Skipping turn.`
    );
  }

  onError(player: IAiPlayerService): void {
    console.error(
      `❌ Game cannot continue due to an API error from ${player.name}.`
    );
  }

  onGameOver(status: 'X_wins' | 'O_wins' | 'draw', winner?: IAiPlayerService): void {
    console.log('\n--- 🏁 GAME OVER ---');
    if (status === 'draw') {
      console.log("It's a draw! Well played by both sides.");
    } else if (winner) {
      console.log(`🏆 Winner is: ${winner.name} (${winner.symbol})!`);
    }
  }
}
