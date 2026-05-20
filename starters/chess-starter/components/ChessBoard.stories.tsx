import type { Meta, StoryObj } from '@storybook/react'
import { ChessBoard } from './ChessBoard'

const meta = {
  title: 'Chess/ChessBoard',
  component: ChessBoard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f0f0f0' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChessBoard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Starting position of a chess game (standard FEN)
 */
export const StartingPosition: Story = {
  args: {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    selectedSquare: null,
    possibleMoves: [],
    lastMove: undefined,
    isInCheck: false,
    onSelectSquare: (square: string) => console.log('Selected square:', square),
    onMakeMove: (move: { from: string; to: string }) =>
      console.log('Move made:', move),
  },
}

/**
 * Board with a piece selected and showing possible moves
 */
export const PieceSelected: Story = {
  args: {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    selectedSquare: 'e2',
    possibleMoves: ['e3', 'e4'],
    lastMove: undefined,
    isInCheck: false,
    onSelectSquare: (square: string) => console.log('Selected square:', square),
    onMakeMove: (move: { from: string; to: string }) =>
      console.log('Move made:', move),
  },
}

/**
 * Board showing the last move with yellow highlight
 */
export const LastMoveHighlighted: Story = {
  args: {
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    selectedSquare: null,
    possibleMoves: [],
    lastMove: { from: 'e2', to: 'e4' },
    isInCheck: false,
    onSelectSquare: (square: string) => console.log('Selected square:', square),
    onMakeMove: (move: { from: string; to: string }) =>
      console.log('Move made:', move),
  },
}

/**
 * Board with king in check (red highlight on king)
 */
export const KingInCheck: Story = {
  args: {
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPQPPP/RNB1KBNR b KQkq - 1 2',
    selectedSquare: null,
    possibleMoves: [],
    lastMove: { from: 'e1', to: 'e4' },
    isInCheck: true,
    onSelectSquare: (square: string) => console.log('Selected square:', square),
    onMakeMove: (move: { from: string; to: string }) =>
      console.log('Move made:', move),
  },
}

/**
 * Board mid-game with several pieces captured
 */
export const MidGame: Story = {
  args: {
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    selectedSquare: null,
    possibleMoves: [],
    lastMove: { from: 'g1', to: 'f3' },
    isInCheck: false,
    onSelectSquare: (square: string) => console.log('Selected square:', square),
    onMakeMove: (move: { from: string; to: string }) =>
      console.log('Move made:', move),
  },
}

/**
 * Board showing pawn promotion scenario (white pawn near 8th rank)
 */
export const PawnPromotionReady: Story = {
  args: {
    fen: 'rnbqkbnr/ppppppP1/8/8/8/8/PPPPPP1P/RNBQKBNR b KQkq - 0 1',
    selectedSquare: null,
    possibleMoves: [],
    lastMove: undefined,
    isInCheck: false,
    onSelectSquare: (square: string) => console.log('Selected square:', square),
    onMakeMove: (move: { from: string; to: string }) =>
      console.log('Move made:', move),
  },
}

/**
 * Endgame scenario with few pieces
 */
export const Endgame: Story = {
  args: {
    fen: '8/8/8/4k3/8/8/4K3/8 w - - 0 1',
    selectedSquare: 'e2',
    possibleMoves: ['d1', 'd2', 'd3', 'e1', 'e3', 'f1', 'f2', 'f3'],
    lastMove: undefined,
    isInCheck: false,
    onSelectSquare: (square: string) => console.log('Selected square:', square),
    onMakeMove: (move: { from: string; to: string }) =>
      console.log('Move made:', move),
  },
}

/**
 * Complex position with multiple pieces and possible captures
 */
export const ComplexPosition: Story = {
  args: {
    fen: 'r1bqkb1r/pp1ppppp/2n2n2/2p1P3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq c6 0 4',
    selectedSquare: 'c4',
    possibleMoves: ['a6', 'b5', 'b3', 'c2', 'd5', 'e6', 'f7'],
    lastMove: { from: 'f1', to: 'c4' },
    isInCheck: false,
    onSelectSquare: (square: string) => console.log('Selected square:', square),
    onMakeMove: (move: { from: string; to: string }) =>
      console.log('Move made:', move),
  },
}
