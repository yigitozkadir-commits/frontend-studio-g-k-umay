import type { Meta, StoryObj } from '@storybook/react'
import { MoveHistory } from './MoveHistory'

const meta = {
  title: 'Chess/MoveHistory',
  component: MoveHistory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MoveHistory>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Empty game history - no moves made
 */
export const Empty: Story = {
  args: {
    history: [],
    currentMoveIndex: -1,
  },
}

/**
 * Single move (white only)
 */
export const SingleMove: Story = {
  args: {
    history: [
      {
        from: 'e2',
        to: 'e4',
        san: 'e4',
        piece: 'P',
      },
    ],
    currentMoveIndex: 0,
  },
}

/**
 * First complete turn (white and black moves)
 */
export const FirstTurn: Story = {
  args: {
    history: [
      {
        from: 'e2',
        to: 'e4',
        san: 'e4',
        piece: 'P',
      },
      {
        from: 'e7',
        to: 'e5',
        san: 'e5',
        piece: 'p',
      },
    ],
    currentMoveIndex: 1,
  },
}

/**
 * Italian Game opening (6 moves)
 */
export const ItalianOpening: Story = {
  args: {
    history: [
      { from: 'e2', to: 'e4', san: 'e4', piece: 'P' },
      { from: 'e7', to: 'e5', san: 'e5', piece: 'p' },
      { from: 'g1', to: 'f3', san: 'Nf3', piece: 'N' },
      { from: 'b8', to: 'c6', san: 'Nc6', piece: 'n' },
      { from: 'f1', to: 'c4', san: 'Bc4', piece: 'B' },
      { from: 'f8', to: 'c5', san: 'Bc5', piece: 'b' },
    ],
    currentMoveIndex: 5,
  },
}

/**
 * Mid-game with captures and complex moves
 */
export const MidGame: Story = {
  args: {
    history: [
      { from: 'e2', to: 'e4', san: 'e4', piece: 'P' },
      { from: 'd7', to: 'd5', san: 'd5', piece: 'p' },
      { from: 'e4', to: 'd5', san: 'exd5', piece: 'P' },
      { from: 'd8', to: 'd5', san: 'Qxd5', piece: 'q' },
      { from: 'b1', to: 'c3', san: 'Nc3', piece: 'N' },
      { from: 'd5', to: 'e5', san: 'Qe5', piece: 'q' },
      { from: 'g1', to: 'f3', san: 'Nf3', piece: 'N' },
      { from: 'c7', to: 'c6', san: 'c6', piece: 'p' },
      { from: 'f1', to: 'c4', san: 'Bc4', piece: 'B' },
      { from: 'e5', to: 'd4', san: 'Qd4', piece: 'q' },
    ],
    currentMoveIndex: 9,
  },
}

/**
 * Endgame with many moves
 */
export const Endgame: Story = {
  args: {
    history: [
      { from: 'e2', to: 'e4', san: 'e4', piece: 'P' },
      { from: 'c7', to: 'c5', san: 'c5', piece: 'p' },
      { from: 'g1', to: 'f3', san: 'Nf3', piece: 'N' },
      { from: 'd7', to: 'd6', san: 'd6', piece: 'p' },
      { from: 'd2', to: 'd4', san: 'd4', piece: 'P' },
      { from: 'c5', to: 'd4', san: 'cxd4', piece: 'p' },
      { from: 'f3', to: 'd4', san: 'Nxd4', piece: 'N' },
      { from: 'g8', to: 'f6', san: 'Nf6', piece: 'n' },
      { from: 'b1', to: 'c3', san: 'Nc3', piece: 'N' },
      { from: 'a7', to: 'a6', san: 'a6', piece: 'p' },
      { from: 'f1', to: 'e2', san: 'Be2', piece: 'B' },
      { from: 'e7', to: 'e5', san: 'e5', piece: 'p' },
      { from: 'd4', to: 'f3', san: 'Nf3', piece: 'N' },
      { from: 'b8', to: 'd7', san: 'Nbd7', piece: 'n' },
      { from: 'e1', to: 'g1', san: 'O-O', piece: 'K' },
      { from: 'f8', to: 'e7', san: 'Be7', piece: 'b' },
      { from: 'a2', to: 'a4', san: 'a4', piece: 'P' },
      { from: 'e8', to: 'g8', san: 'O-O', piece: 'k' },
      { from: 'f1', to: 'e1', san: 'Re1', piece: 'R' },
      { from: 'c8', to: 'f5', san: 'Bf5', piece: 'b' },
    ],
    currentMoveIndex: 19,
  },
}

/**
 * Game with special moves (castling, en passant notation)
 */
export const SpecialMoves: Story = {
  args: {
    history: [
      { from: 'e2', to: 'e4', san: 'e4', piece: 'P' },
      { from: 'e7', to: 'e5', san: 'e5', piece: 'p' },
      { from: 'g1', to: 'f3', san: 'Nf3', piece: 'N' },
      { from: 'g8', to: 'f6', san: 'Nf6', piece: 'n' },
      { from: 'f1', to: 'c4', san: 'Bc4', piece: 'B' },
      { from: 'f8', to: 'c5', san: 'Bc5', piece: 'b' },
      { from: 'e1', to: 'g1', san: 'O-O', piece: 'K' },
      { from: 'e8', to: 'g8', san: 'O-O', piece: 'k' },
      { from: 'b2', to: 'b4', san: 'b4', piece: 'P' },
      { from: 'c5', to: 'b4', san: 'Bxb4', piece: 'b' },
    ],
    currentMoveIndex: 9,
  },
}

/**
 * Long game with piece promotion
 */
export const WithPromotion: Story = {
  args: {
    history: [
      { from: 'e2', to: 'e4', san: 'e4', piece: 'P' },
      { from: 'c7', to: 'c5', san: 'c5', piece: 'p' },
      { from: 'g1', to: 'f3', san: 'Nf3', piece: 'N' },
      { from: 'd7', to: 'd6', san: 'd6', piece: 'p' },
      { from: 'd2', to: 'd4', san: 'd4', piece: 'P' },
      { from: 'c5', to: 'd4', san: 'cxd4', piece: 'p' },
      { from: 'f3', to: 'd4', san: 'Nxd4', piece: 'N' },
      { from: 'g8', to: 'f6', san: 'Nf6', piece: 'n' },
      { from: 'e2', to: 'e4', san: 'e4', piece: 'P' },
      { from: 'a7', to: 'a5', san: 'a5', piece: 'p' },
      { from: 'f1', to: 'e2', san: 'Be2', piece: 'B' },
      { from: 'e7', to: 'e5', san: 'e5', piece: 'p' },
      { from: 'a2', to: 'a7', san: 'a7', piece: 'P' },
      { from: 'a8', to: 'a7', san: 'Rxa7', piece: 'r' },
      { from: 'a7', to: 'a8', san: 'a8=Q+', piece: 'P' },
    ],
    currentMoveIndex: 14,
  },
}

/**
 * Active move highlighting (last move selected)
 */
export const ActiveMoveSelection: Story = {
  args: {
    history: [
      { from: 'e2', to: 'e4', san: 'e4', piece: 'P' },
      { from: 'e7', to: 'e5', san: 'e5', piece: 'p' },
      { from: 'g1', to: 'f3', san: 'Nf3', piece: 'N' },
      { from: 'b8', to: 'c6', san: 'Nc6', piece: 'n' },
      { from: 'f1', to: 'c4', san: 'Bc4', piece: 'B' },
    ],
    currentMoveIndex: 2, // Highlighting Nf3
  },
}
