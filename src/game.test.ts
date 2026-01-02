import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { Game } from './game.js';
import type { GameUI } from './ui.js';
import type { IAiPlayerService, ApiInput, ApiResponse, Move } from './types.js';

// Mock UI
const mockUI: jest.Mocked<GameUI> = {
  onGameStart: jest.fn(),
  onTurnStart: jest.fn(),
  onBoardUpdate: jest.fn(),
  onMoveFunction: jest.fn(),
  onMoveMade: jest.fn(),
  onInvalidMove: jest.fn(),
  onError: jest.fn(),
  onGameOver: jest.fn(),
};

// Mock Player
class MockPlayer implements IAiPlayerService {
  constructor(public name: string, public symbol: 'X' | 'O', private moves: Move[]) {}
  
  async getMove(payload: ApiInput): Promise<ApiResponse> {
    const move = this.moves.shift();
    if (!move) throw new Error('No more moves mocked');
    return {
      move,
      reasoning: 'Test reasoning',
      trashTalk: 'Test trash talk'
    };
  }
}

describe('Game Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('X wins immediately (fast win)', async () => {
    // X plays (0,0), (0,1), (0,2) to win row 0.
    // O plays (1,0), (1,1)
    const playerX = new MockPlayer('BotX', 'X', [{row:0, col:0}, {row:0, col:1}, {row:0, col:2}]);
    const playerO = new MockPlayer('BotO', 'O', [{row:1, col:0}, {row:1, col:1}]);
    
    const game = new Game(playerX, playerO, mockUI);
    await game.play();

    expect(mockUI.onGameOver).toHaveBeenCalledWith('X_wins', playerX);
  });

  test('Draw game', async () => {
    // X O X
    // X O X
    // O X O
    const playerX_moves = [
        {row:0, col:0}, {row:0, col:2}, // Row 0
        {row:1, col:0}, {row:1, col:2}, // Row 1
        {row:2, col:1}                  // Row 2
    ];
    const playerO_moves = [
        {row:0, col:1},
        {row:1, col:1},
        {row:2, col:0}, {row:2, col:2}
    ];

    const playerX = new MockPlayer('BotX', 'X', playerX_moves);
    const playerO = new MockPlayer('BotO', 'O', playerO_moves);

    const game = new Game(playerX, playerO, mockUI);
    await game.play();

    expect(mockUI.onGameOver).toHaveBeenCalledWith('draw');
  });
});
