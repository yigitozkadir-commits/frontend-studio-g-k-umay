import type { Meta, StoryObj } from '@storybook/react'
import { PromotionDialog } from './PromotionDialog'

const meta = {
  title: 'Chess/PromotionDialog',
  component: PromotionDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PromotionDialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Promotion dialog for white pawn (8th rank)
 */
export const WhitePawnPromotion: Story = {
  args: {
    isOpen: true,
    color: 'w',
    onPromote: (piece: string) => console.log('Promoted to:', piece),
    onCancel: () => console.log('Promotion cancelled'),
  },
}

/**
 * Promotion dialog for black pawn (1st rank)
 */
export const BlackPawnPromotion: Story = {
  args: {
    isOpen: true,
    color: 'b',
    onPromote: (piece: string) => console.log('Promoted to:', piece),
    onCancel: () => console.log('Promotion cancelled'),
  },
}

/**
 * Closed dialog (hidden)
 */
export const Closed: Story = {
  args: {
    isOpen: false,
    color: 'w',
    onPromote: (piece: string) => console.log('Promoted to:', piece),
    onCancel: () => console.log('Promotion cancelled'),
  },
}

/**
 * Dialog with interactive promotion handler
 */
export const Interactive: Story = {
  args: {
    isOpen: true,
    color: 'w',
    onPromote: (piece: string) => {
      alert(`Pawn promoted to ${piece.toUpperCase()}`);
    },
    onCancel: () => {
      alert('Promotion cancelled');
    },
  },
}

/**
 * Dialog showing black pawn promotion with interactive handlers
 */
export const BlackInteractive: Story = {
  args: {
    isOpen: true,
    color: 'b',
    onPromote: (piece: string) => {
      alert(`Pion ${piece.toLowerCase()} olarak terfi etti`);
    },
    onCancel: () => {
      alert('Terfi iptal edildi');
    },
  },
}
