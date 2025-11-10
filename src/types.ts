// src/types.ts

// --- Core Game Types ---
export type PlayerSymbol = 'X' | 'O';
export type Cell = PlayerSymbol | null;
export type Board = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
];

export interface Move {
  row: number;
  col: number;
}

// The full data payload sent to an AI for its turn.
export interface ApiInput {
  context: {
    gameRules: string;
    // yourPersona: {
    //   symbol: PlayerSymbol;
    //   name: string;
    //   personality: string;
    // };
    // opponent: {
    //   name: string;
    //   // lastTrashTalk: string | null;
    // };
  };
  gameState: {
    turnNumber: number;
    board: string;
    frozenCell: Move | null;
    gameStatus: 'ongoing' | 'X_wins' | 'O_wins' | 'draw';
  };
  instructions: {
    task: string;
    responseFormat: string;
  };
}

// The expected JSON structure returned by the AI.
export interface ApiResponse {
  move: Move;
  reasoning: string;
  trashTalk: string;
}

// --- AI Player Service Interface ---
export interface IAiPlayerService {
  name: string;
  symbol: PlayerSymbol;
  getMove(payload: ApiInput): Promise<ApiResponse>;
}

// Describes the structure of a successful response from the Gemini API
export interface GeminiApiResponse {
  candidates: [
    {
      content: {
        parts: [
          {
            text: string;
          }
        ];
      };
    }
  ];
}

// Describes the structure of a successful response from the OpenAI/ChatGPT API
export interface OpenAiApiResponse {
  choices: [
    {
      message: {
        content: string;
      };
    }
  ];
}
