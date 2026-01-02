# 🤖 AI Tic-Tac-Toe Arena

**Where Large Language Models Battle for Supremacy.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## 📜 Overview

**AI Tic-Tac-Toe Arena** is a console-based battleground where different AI agents (OpenAI's GPT, Google's Gemini, DeepSeek) compete against each other in a classic game of Tic-Tac-Toe. 

But this isn't just a simple game. It features:
- **Trash-Talking Personas**: AIs don't just play; they taunt, brag, and try to psychologically dismantle their opponent.
- **Dynamic Hazards**: 'Frozen Cells' appear randomly to block strategic moves, forcing the AIs to adapt.
- **Plug-and-Play Architecture**: Easily swap out models to see who reigns supreme (e.g., GPT-4o vs. DeepSeek-Chat).

## ✨ Features

- **Multi-Provider Support**: Built-in support for:
  - 🟢 **OpenAI** (GPT-3.5, GPT-4, GPT-4o)
  - 🔵 **Google Gemini**
  - 🟣 **DeepSeek**
- **Robust Game Engine**: Handles turn management, invalid move detection, and win/draw logic.
- **Chaos Mode**: a 33% chance of a random cell freezing on turns 1-7, making it unusable for that turn.
- **Console Interface**: Visual board representation with clear logging of moves and AI dialogue.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- API Keys for the providers you want to use (OpenAI, Gemini, DeepSeek).

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/namtroi/ai-tic-tac-toe.git
    cd ai-tic-tac-toe
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```bash
    cp .env.example .env  # or just create a new file
    ```
    Add your API keys:
    ```env
    OPENAI_API_KEY=your_openai_key_here
    GEMINI_API_KEY=your_gemini_key_here
    DEEPSEEK_API_KEY=your_deepseek_key_here
    ```

### ▶️ Running the Game

To start the battle:

```bash
npm start
```
*Note: This runs the compiled JavaScript. For development mode with on-the-fly compilation:*

```bash
npm run dev
```

## 🛠️ Customizing the Matchup

You can configure which AI models fight each other by editing `src/index.ts`.

1.  Open `src/index.ts`.
2.  Locate the player initialization section.
3.  Instantiate your desired providers:

```typescript
// Example: GPT-4o vs DeepSeek
const player1 = new ChatGptProvider('X', process.env.OPENAI_API_KEY!, 'gpt-4o');
const player2 = new DeepseekProvider('O', process.env.DEEPSEEK_API_KEY!, 'deepseek-chat');

// Start the game
const game = new Game(player1, player2);
game.play();
```

## 🤝 Contributing

Contributions are welcome! If you want to add a new AI provider (e.g., Anthropic Claude, Mistral) or a new game mechanic:

1.  Fork the repo.
2.  Create your feature branch (`git checkout -b feature/AmazingNewAI`).
3.  Implement the `IAiPlayerService` interface.
4.  Commit your changes.
5.  Push to the branch.
6.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ by Nam Troi*
