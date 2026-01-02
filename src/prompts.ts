export const GamePrompts = {
  gameRules:
    "3x3 Tic-Tac-Toe. Win with 3 in a row (any direction). X goes first. On turns 1-7, there's a 33% chance a random empty cell gets frozen for the turn. You can't play on a frozen cell. No freezing on turns 8-9.",
  
  taskInstructions:
    "Analyze the `gameState.board`. The board is a multi-line string where '.' represents an empty cell. " +
    'You MUST follow this priority: ' +
    '1. Find a move that wins the game. ' +
    "2. If no winning move, find a move that BLOCKS your opponent's winning move. " +
    '3. If neither, find the best strategic move. ' +
    '4. You cannot play in the `frozenCell`.',
  
  responseFormat:
    "You must respond with a valid JSON object. The JSON must contain these exact keys: 'move' (an object with 'row' and 'col' keys), and 'trashTalk' (a short, biting taunt).",
};
