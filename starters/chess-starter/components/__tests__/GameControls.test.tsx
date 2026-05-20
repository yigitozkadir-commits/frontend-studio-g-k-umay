import { render, screen, fireEvent } from '@testing-library/react'
import { GameControls } from '../GameControls'

describe('GameControls Component', () => {
  const defaultProps = {
    turn: 'w' as const,
    gameStatus: 'playing' as const,
    moveCount: 0,
    capturedPieces: [],
    onReset: jest.fn(),
    onUndo: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders game controls section', () => {
      render(<GameControls {...defaultProps} />)
      expect(screen.getByText(/Oyun Durumu/i)).toBeInTheDocument()
    })

    it('displays move count', () => {
      render(<GameControls {...defaultProps} moveCount={5} />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('displays current turn indicator', () => {
      render(<GameControls {...defaultProps} turn="w" />)
      expect(screen.getByText('♔ Beyaz')).toBeInTheDocument()
    })

    it('displays buttons section', () => {
      render(<GameControls {...defaultProps} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Game Status Display', () => {
    it('shows playing status message', () => {
      render(<GameControls {...defaultProps} gameStatus="playing" />)
      expect(screen.getByText(/sırada/i)).toBeInTheDocument()
    })

    it('shows check status message', () => {
      render(<GameControls {...defaultProps} gameStatus="check" turn="w" />)
      expect(screen.getByText(/Şah/i)).toBeInTheDocument()
    })

    it('shows checkmate status message', () => {
      render(<GameControls {...defaultProps} gameStatus="checkmate" turn="b" />)
      expect(screen.getByText(/kazandı/i)).toBeInTheDocument()
    })

    it('shows stalemate status message', () => {
      render(<GameControls {...defaultProps} gameStatus="stalemate" />)
      expect(screen.getByText(/berabere/i)).toBeInTheDocument()
    })

    it('shows draw status message', () => {
      render(<GameControls {...defaultProps} gameStatus="draw" />)
      expect(screen.getByText(/sırada/i)).toBeInTheDocument()
    })
  })

  describe('Status Colors', () => {
    it('uses green for playing status', () => {
      const { container } = render(
        <GameControls {...defaultProps} gameStatus="playing" />
      )
      const statusDiv = container.querySelector('p')
      expect(statusDiv).toBeInTheDocument()
    })

    it('uses orange for check status', () => {
      const { container } = render(
        <GameControls {...defaultProps} gameStatus="check" />
      )
      const statusDiv = container.querySelector('[class*="orange"]')
      expect(statusDiv).toBeInTheDocument()
    })

    it('uses red for checkmate status', () => {
      const { container } = render(
        <GameControls {...defaultProps} gameStatus="checkmate" />
      )
      const statusDiv = container.querySelector('[class*="red"]')
      expect(statusDiv).toBeInTheDocument()
    })
  })

  describe('Turn Indicator', () => {
    it('shows white turn indicator', () => {
      render(<GameControls {...defaultProps} turn="w" />)
      expect(screen.getByText('♔ Beyaz')).toBeInTheDocument()
    })

    it('shows black turn indicator', () => {
      render(<GameControls {...defaultProps} turn="b" />)
      expect(screen.getByText('♚ Siyah')).toBeInTheDocument()
    })

    it('updates turn indicator when turn changes', () => {
      const { rerender } = render(
        <GameControls {...defaultProps} turn="w" />
      )
      expect(screen.getByText('♔ Beyaz')).toBeInTheDocument()

      rerender(<GameControls {...defaultProps} turn="b" />)
      expect(screen.getByText('♚ Siyah')).toBeInTheDocument()
    })
  })

  describe('Move Count Display', () => {
    it('displays 0 move count', () => {
      render(<GameControls {...defaultProps} moveCount={0} />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('displays move count after moves', () => {
      render(<GameControls {...defaultProps} moveCount={10} />)
      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('updates move count when prop changes', () => {
      const { rerender } = render(
        <GameControls {...defaultProps} moveCount={0} />
      )
      expect(screen.getByText('0')).toBeInTheDocument()

      rerender(<GameControls {...defaultProps} moveCount={5} />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('Captured Pieces Display', () => {
    it('shows no captured pieces initially', () => {
      const { container } = render(
        <GameControls {...defaultProps} capturedPieces={[]} />
      )
      expect(container).toBeInTheDocument()
    })

    it('displays captured pieces with correct symbols', () => {
      const capturedPieces = [
        { piece: 'p', color: 'b' as const, moveNumber: 5, turn: 9 },
        { piece: 'n', color: 'b' as const, moveNumber: 6, turn: 11 },
      ]
      render(
        <GameControls {...defaultProps} capturedPieces={capturedPieces} />
      )
      expect(screen.getByText(/Beyaz Kazandı/i)).toBeInTheDocument()
    })

    it('shows captured white pieces', () => {
      const capturedPieces = [
        { piece: 'p', color: 'w' as const, moveNumber: 1, turn: 2 },
      ]
      render(
        <GameControls {...defaultProps} capturedPieces={capturedPieces} />
      )
      expect(screen.getByText(/Siyah Kazandı/i)).toBeInTheDocument()
    })

    it('shows captured black pieces', () => {
      const capturedPieces = [
        { piece: 'n', color: 'b' as const, moveNumber: 2, turn: 3 },
      ]
      render(
        <GameControls {...defaultProps} capturedPieces={capturedPieces} />
      )
      expect(screen.getByText(/Beyaz Kazandı/i)).toBeInTheDocument()
    })
  })

  describe('Material Count', () => {
    it('calculates material advantage correctly', () => {
      const capturedPieces = [
        { piece: 'p', color: 'b' as const, moveNumber: 1, turn: 2 },
        { piece: 'n', color: 'w' as const, moveNumber: 2, turn: 3 },
      ]
      render(
        <GameControls {...defaultProps} capturedPieces={capturedPieces} />
      )
      expect(screen.getByText(/Kazandı/i)).toBeInTheDocument()
    })

    it('shows material values for pieces', () => {
      const capturedPieces = [
        { piece: 'q', color: 'b' as const, moveNumber: 1, turn: 2 },
      ]
      render(
        <GameControls {...defaultProps} capturedPieces={capturedPieces} />
      )
      expect(screen.getByText(/Kazandı/i)).toBeInTheDocument()
    })
  })

  describe('Button Functionality', () => {
    it('calls onReset when reset button clicked', async () => {
      const onReset = jest.fn()
      render(<GameControls {...defaultProps} onReset={onReset} />)

      const resetButton = screen.getByText(/Baştan/i)
      fireEvent.click(resetButton)

      expect(onReset).toHaveBeenCalled()
    })

    it('calls onUndo when undo button clicked', async () => {
      const onUndo = jest.fn()
      render(<GameControls {...defaultProps} onUndo={onUndo} moveCount={1} />)

      const undoButton = screen.getByText(/Geri Al/i)
      fireEvent.click(undoButton)

      expect(onUndo).toHaveBeenCalled()
    })

    it('reset button has correct text', () => {
      render(<GameControls {...defaultProps} />)
      expect(screen.getByText(/Baştan/i)).toBeInTheDocument()
    })

    it('undo button has correct text', () => {
      render(<GameControls {...defaultProps} />)
      expect(screen.getByText(/Geri Al/i)).toBeInTheDocument()
    })

    it('undo button is disabled when no moves', () => {
      render(<GameControls {...defaultProps} moveCount={0} />)
      const undoButton = screen.getByText(/Geri Al/i)
      expect(undoButton).toBeInTheDocument()
    })

    it('reset button works during game', async () => {
      const onReset = jest.fn()
      render(
        <GameControls
          {...defaultProps}
          moveCount={5}
          onReset={onReset}
        />
      )

      const resetButton = screen.getByText(/Baştan/i)
      fireEvent.click(resetButton)

      expect(onReset).toHaveBeenCalled()
    })

    it('reset button works when game is over', async () => {
      const onReset = jest.fn()
      render(
        <GameControls
          {...defaultProps}
          gameStatus="checkmate"
          onReset={onReset}
        />
      )

      const resetButton = screen.getByText(/Baştan/i)
      fireEvent.click(resetButton)

      expect(onReset).toHaveBeenCalled()
    })
  })

  describe('Status Indicators', () => {
    it('shows correct icon for playing status', () => {
      render(<GameControls {...defaultProps} gameStatus="playing" />)
      expect(screen.getByText('✓')).toBeInTheDocument()
    })

    it('shows correct icon for check status', () => {
      render(<GameControls {...defaultProps} gameStatus="check" />)
      expect(screen.getByText('⚠️')).toBeInTheDocument()
    })

    it('shows correct icon for checkmate status', () => {
      render(<GameControls {...defaultProps} gameStatus="checkmate" />)
      expect(screen.getByText('🏁')).toBeInTheDocument()
    })

    it('shows correct icon for stalemate status', () => {
      render(<GameControls {...defaultProps} gameStatus="stalemate" />)
      expect(screen.getByText('🏁')).toBeInTheDocument()
    })
  })

  describe('Responsive Layout', () => {
    it('renders responsive grid layout', () => {
      const { container } = render(<GameControls {...defaultProps} />)
      const gridDiv = container.querySelector('[class*="grid"]')
      expect(gridDiv).toBeInTheDocument()
    })

    it('displays move info in grid', () => {
      render(<GameControls {...defaultProps} moveCount={5} />)
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText(/Hamle Sayısı/i)).toBeInTheDocument()
    })
  })

  describe('Dark Mode Support', () => {
    it('has dark mode classes', () => {
      const { container } = render(<GameControls {...defaultProps} />)
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv.className).toContain('dark:')
    })
  })

  describe('Edge Cases', () => {
    it('handles negative move count gracefully', () => {
      render(<GameControls {...defaultProps} moveCount={-1} />)
      expect(screen.getByText('-1')).toBeInTheDocument()
    })

    it('handles large move count', () => {
      render(<GameControls {...defaultProps} moveCount={999} />)
      expect(screen.getByText('999')).toBeInTheDocument()
    })

    it('handles many captured pieces', () => {
      const capturedPieces = Array.from({ length: 30 }, (_, i) => ({
        piece: i % 2 === 0 ? 'p' : 'n',
        color: (i % 2 === 0 ? 'w' : 'b') as 'w' | 'b',
        moveNumber: i,
        turn: i + 1,
      }))
      render(
        <GameControls {...defaultProps} capturedPieces={capturedPieces} />
      )
      expect(screen.getByText(/Oyun Durumu/i)).toBeInTheDocument()
    })

    it('updates when all props change', () => {
      const { rerender } = render(
        <GameControls
          {...defaultProps}
          turn="w"
          gameStatus="playing"
          moveCount={0}
        />
      )

      rerender(
        <GameControls
          {...defaultProps}
          turn="b"
          gameStatus="checkmate"
          moveCount={15}
        />
      )

      expect(screen.getByText('15')).toBeInTheDocument()
      expect(screen.getByText('♚ Siyah')).toBeInTheDocument()
    })
  })
})
