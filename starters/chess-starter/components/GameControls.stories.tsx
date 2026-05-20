import type { Meta, StoryObj } from '@storybook/react'
import { GameControls } from './GameControls'

const meta = {
  title: 'Chess/GameControls',
  component: GameControls,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GameControls>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Initial game state with no moves made
 */
export const GameStart: Story = {
  args: {
    turn: 'w',
    gameStatus: 'playing',
    moveCount: 0,
    capturedPieces: [],
    onReset: () => console.log('Game reset'),
    onUndo: () => console.log('Undo move'),
  },
}

/**
 * Game in progress with some moves
 */
export const MidGame: Story = {
  args: {
    turn: 'b',
    gameStatus: 'playing',
    moveCount: 4,
    capturedPieces: [
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'b' },
      { piece: 'n', color: 'b' },
    ],
    onReset: () => console.log('Game reset'),
    onUndo: () => console.log('Undo move'),
  },
}

/**
 * Game with king in check
 */
export const KingInCheck: Story = {
  args: {
    turn: 'b',
    gameStatus: 'check',
    moveCount: 8,
    capturedPieces: [
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'b' },
      { piece: 'p', color: 'b' },
      { piece: 'n', color: 'w' },
    ],
    onReset: () => console.log('Game reset'),
    onUndo: () => console.log('Undo move'),
  },
}

/**
 * Checkmate scenario - game over
 */
export const Checkmate: Story = {
  args: {
    turn: 'b',
    gameStatus: 'checkmate',
    moveCount: 15,
    capturedPieces: [
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'b' },
      { piece: 'n', color: 'w' },
      { piece: 'b', color: 'b' },
      { piece: 'r', color: 'w' },
    ],
    onReset: () => console.log('Game reset'),
    onUndo: () => console.log('Undo move'),
  },
}

/**
 * Stalemate scenario - draw
 */
export const Stalemate: Story = {
  args: {
    turn: 'w',
    gameStatus: 'stalemate',
    moveCount: 42,
    capturedPieces: [
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'b' },
      { piece: 'p', color: 'b' },
      { piece: 'n', color: 'w' },
      { piece: 'n', color: 'b' },
      { piece: 'b', color: 'w' },
      { piece: 'r', color: 'b' },
      { piece: 'q', color: 'w' },
    ],
    onReset: () => console.log('Game reset'),
    onUndo: () => console.log('Undo move'),
  },
}

/**
 * Game with significant material imbalance (white winning)
 */
export const WhiteWinning: Story = {
  args: {
    turn: 'w',
    gameStatus: 'playing',
    moveCount: 20,
    capturedPieces: [
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'b' },
      { piece: 'p', color: 'b' },
      { piece: 'p', color: 'b' },
      { piece: 'n', color: 'b' },
      { piece: 'b', color: 'b' },
      { piece: 'r', color: 'b' },
      { piece: 'p', color: 'b' },
    ],
    onReset: () => console.log('Game reset'),
    onUndo: () => console.log('Undo move'),
  },
}

/**
 * Game with significant material imbalance (black winning)
 */
export const BlackWinning: Story = {
  args: {
    turn: 'w',
    gameStatus: 'playing',
    moveCount: 22,
    capturedPieces: [
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'w' },
      { piece: 'n', color: 'w' },
      { piece: 'b', color: 'w' },
      { piece: 'r', color: 'w' },
      { piece: 'p', color: 'b' },
      { piece: 'p', color: 'b' },
    ],
    onReset: () => console.log('Game reset'),
    onUndo: () => console.log('Undo move'),
  },
}

/**
 * Early endgame with many pieces captured
 */
export const Endgame: Story = {
  args: {
    turn: 'b',
    gameStatus: 'playing',
    moveCount: 32,
    capturedPieces: [
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'w' },
      { piece: 'p', color: 'w' },
      { piece: 'n', color: 'w' },
      { piece: 'b', color: 'w' },
      { piece: 'n', color: 'b' },
      { piece: 'b', color: 'b' },
      { piece: 'p', color: 'b' },
      { piece: 'p', color: 'b' },
    ],
    onReset: () => console.log('Game reset'),
    onUndo: () => console.log('Undo move'),
  },
}

/**
 * Game at one move (undo button enabled)
 */
export const SingleMove: Story = {
  args: {
    turn: 'b',
    gameStatus: 'playing',
    moveCount: 1,
    capturedPieces: [],
    onReset: () => console.log('Game reset'),
    onUndo: () => console.log('Undo move'),
  },
}
