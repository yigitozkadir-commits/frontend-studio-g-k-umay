# ♟️ Chess Starter - Interactive 2-Player Chess Game

A fully functional, real-time chess game built with **Next.js 14**, **React 18**, **TypeScript**, and **Tailwind CSS**. 
This is a complete chess starter template featuring board representation, move validation, game state management, 
and comprehensive testing with Jest.

**Version:** 4.0.0 | **License:** MIT

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:3000
```

### Build for Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## ✨ Key Features

### Game Features
- **♞ Full Chess Rules Implementation**
  - Piece movement validation
  - Check and checkmate detection
  - Stalemate and draw detection
  - Castling (kingside and queenside)
  - En passant captures
  - Pawn promotion with piece selection

- **🎮 Intuitive Gameplay**
  - Click to select piece, click to move
  - Visual highlight of possible moves
  - Last move highlighting
  - Check indicator with animation
  - Undo/Reset functionality

- **📋 Game History**
  - Move notation in Standard Algebraic Notation (SAN)
  - PGN export capability
  - Move counter and game stats
  - Captured pieces display

### User Interface
- **🎨 Beautiful Chess Board**
  - 8x8 grid with proper square coloring
  - Unicode chess piece symbols
  - Responsive design (mobile, tablet, desktop)
  - Smooth animations and transitions

- **🌙 Dark Mode Support**
  - Auto-detect system preference
  - Manual toggle switch
  - Tailwind CSS theming

- **⌨️ Keyboard Navigation**
  - Arrow keys to navigate squares
  - Enter to confirm move
  - Escape to deselect
  - Keyboard shortcuts for common actions

### Technical Features
- **TypeScript** for type safety
- **React Hooks** for state management (custom `useGame` hook)
- **Chess.js** for robust game logic
- **Jest + React Testing Library** with 75%+ coverage
- **Next.js 14** with App Router
- **Tailwind CSS** for styling

---

## 📦 Project Structure

```
chess-starter/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main game page (dynamic import)
│   ├── globals.css             # Global styles
│   └── api/game/route.ts       # API endpoints
│
├── components/
│   ├── Game.tsx                # Main game orchestrator
│   ├── ChessBoard.tsx          # Chess board with 64 squares
│   ├── GameControls.tsx        # Status, undo, reset buttons
│   ├── MoveHistory.tsx         # Move list and PGN export
│   ├── PromotionDialog.tsx     # Pawn promotion UI
│   └── __tests__/
│       ├── Game.test.tsx       # Integration tests
│       ├── ChessBoard.test.tsx # Board rendering & interaction
│       └── GameControls.test.tsx # Controls & status display
│
├── hooks/
│   ├── useGame.ts              # Main game state hook
│   ├── useChessEngine.ts       # Chess.js wrapper hook
│   └── __tests__/
│       ├── useGame.test.ts     # Hook unit tests
│       └── useChessEngine.test.ts # Engine tests
│
├── lib/
│   ├── gameUtils.ts            # Utilities (piece symbols, validation)
│   └── __tests__/gameUtils.test.ts # Utility tests
│
├── public/                      # Static assets
├── jest.config.cjs             # Jest configuration
├── jest.setup.cjs              # Jest setup file
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind configuration
└── next.config.js              # Next.js configuration
```

---

## 🎮 How to Play

### Starting a Game
1. **Open the app** at `http://localhost:3000`
2. **White always goes first** with 20 possible opening moves
3. **Black responds** with their move

### Making Moves
1. **Click a piece** to select it (shows possible moves in green)
2. **Click destination square** to move
3. **Invalid moves are rejected** automatically
4. **Promotion dialog appears** when pawn reaches the last rank

### Game Features
- **Undo Move**: Click the ↶ button to take back the last move
- **Reset Game**: Click the 🔄 button to start over
- **Move Counter**: Track the number of moves made
- **Captured Pieces**: See which pieces have been taken
- **Game Status**: Check if you're in check, checkmate, stalemate, or have a draw

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| ↑ ↓ ← → | Navigate board squares |
| Enter | Confirm move |
| Escape | Deselect piece |
| Ctrl+Z | Undo move |

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (re-run on file changes)
pnpm test:watch

# Generate coverage report
pnpm test --coverage
```

### Test Coverage

The project includes comprehensive tests with **75%+ coverage**:

- **useGame Hook** (40+ tests)
  - Piece movement validation
  - Pawn promotion
  - Move history tracking
  - Game status detection
  - Undo/Reset functionality

- **Component Tests** (25+ tests)
  - ChessBoard rendering
  - Square selection and highlighting
  - Move execution
  - Keyboard navigation
  - Accessibility

- **Game Utilities** (30+ tests)
  - Piece symbols and names
  - Square coordinates
  - Material count calculation
  - FEN notation

- **Chess Engine Tests** (20+ tests)
  - Castling rules
  - En passant captures
  - Promotion validation
  - Game state detection

---

## 🛠️ Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run TypeScript type checking
pnpm type-check

# Run ESLint
pnpm lint

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

---

## 🎨 Customization

### Chess Board Styling

Customize colors in `tailwind.config.ts`:

```typescript
chess: {
  light: '#f0d9b5',
  dark: '#b58863',
}
```

### Theme Colors

Tailwind CSS theme can be extended in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      chess: {
        light: '#f0d9b5',
        dark: '#b58863',
      }
    }
  }
}
```

### Dark Mode

Dark mode is automatically detected from system preference. Toggle in code:

```typescript
// Add dark mode toggle to your components
document.documentElement.classList.toggle('dark')
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel automatically builds and deploys
4. Visit your live URL

### Deploy to Other Platforms

```bash
# Build production bundle
pnpm build

# Output is in .next/ directory
# Deploy the .next folder to your hosting
```

### Environment Variables

Create `.env.local` for local development:

```env
# Example - no required env vars for basic setup
NEXT_PUBLIC_CHESS_VERSION=4.0.0
```

---

## 📊 Game Statistics

The app tracks:
- **Total moves** made in current game
- **Captured pieces** by both sides
- **Material advantage** calculation
- **Game status** (playing, check, checkmate, stalemate, draw)
- **Move notation** in algebraic format

---

## 🐛 Known Limitations & Future Improvements

### Current Limitations
- Single device (no online multiplayer)
- No game time/clock system
- No AI opponent
- No game database storage
- No sound effects

### Planned Improvements
- Online multiplayer via WebSocket
- Chess.com/Lichess.org integration
- Move analysis and rating
- Game replays and annotations
- Sound effects and haptic feedback
- ELO rating calculation
- 1v1 tournament mode

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Maintain 75%+ test coverage
- Use TypeScript for type safety
- Follow existing code style
- Update documentation

---

## 📚 Resources & References

- [Chess.js Documentation](https://github.com/jhlywa/chess.js)
- [React Chessboard](https://react-chessboard.squarely.com/)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [React 18 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Jest Testing Library](https://testing-library.com/)
- [Chess Rules (FIDE)](https://www.fide.com/FIDE/handbook/LawsOfChess.pdf)

---

## 📄 License

**MIT License** - Frontend Studio AI v4.0

You are free to use, modify, and distribute this project in your own applications.

---

## 👨‍💻 Author

Frontend Studio AI - Interactive Chess Game Starter Template

---

## 🎯 Roadmap

- [ ] WebSocket multiplayer support
- [ ] Chess engine integration (Stockfish.js)
- [ ] Game analysis and move suggestions
- [ ] PGN import/export with annotations
- [ ] ELO rating system
- [ ] Tournament brackets
- [ ] Mobile app wrapper
- [ ] Real-time notifications

---

**Happy Playing! ♟️**
