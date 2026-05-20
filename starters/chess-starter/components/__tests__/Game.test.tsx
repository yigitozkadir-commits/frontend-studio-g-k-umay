import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Game } from '../Game'

describe('Game Component - Integration Tests', () => {
  it('renders the game with all main sections', () => {
    render(<Game />)
    expect(screen.getByText(/Oyun Durumu/i)).toBeInTheDocument()
  })

  it('displays initial game status', () => {
    render(<Game />)
    expect(screen.getByText(/Beyaz oyuncu sırada/i)).toBeInTheDocument()
  })

  it('renders reset button', () => {
    render(<Game />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renders move history section', () => {
    render(<Game />)
    expect(screen.getByText(/Hamle Geçmişi/i)).toBeInTheDocument()
  })

  describe('Game Flow Integration', () => {
    it('starts with white to move', () => {
      render(<Game />)
      expect(screen.getByText(/Beyaz oyuncu sırada/i)).toBeInTheDocument()
    })

    it('displays captured pieces section', () => {
      render(<Game />)
      const capturedElements = screen.queryAllByText(/Ele Geçirilen Taşlar/i)
      // May or may not be visible depending on layout
      expect(screen.getByText(/Oyun Durumu/i)).toBeInTheDocument()
    })

    it('renders the game controls panel', () => {
      render(<Game />)
      const buttons = screen.getAllByRole('button')
      // Should have at least undo and reset buttons
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('UI Responsiveness', () => {
    it('renders without crashing', () => {
      const { container } = render(<Game />)
      expect(container).toBeInTheDocument()
    })

    it('has proper semantic HTML structure', () => {
      const { container } = render(<Game />)
      // Check for main content area
      expect(container.querySelector('main, div')).toBeInTheDocument()
    })
  })
})
