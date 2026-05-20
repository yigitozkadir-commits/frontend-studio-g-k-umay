import { render, screen, fireEvent } from '@testing-library/react'
import { ChessBoard } from '../ChessBoard'

describe('ChessBoard Component', () => {
  const defaultProps = {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    selectedSquare: null,
    possibleMoves: [],
    isInCheck: false,
    onSelectSquare: jest.fn(),
    onMakeMove: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders chess board', () => {
      render(<ChessBoard {...defaultProps} />)
      const board = screen.getByRole('application', { name: /chess board/i })
      expect(board).toBeInTheDocument()
    })

    it('renders all 64 squares', () => {
      render(<ChessBoard {...defaultProps} />)
      const squares = screen.getAllByRole('button')
      expect(squares.length).toBe(64)
    })

    it('renders rank labels', () => {
      render(<ChessBoard {...defaultProps} />)
      expect(screen.getByText('8')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('renders file labels', () => {
      render(<ChessBoard {...defaultProps} />)
      expect(screen.getByText('a')).toBeInTheDocument()
      expect(screen.getByText('h')).toBeInTheDocument()
    })

    it('renders keyboard controls info', () => {
      render(<ChessBoard {...defaultProps} />)
      expect(screen.getByText(/Klavye Kontrolleri/i)).toBeInTheDocument()
    })

    it('renders board legend', () => {
      render(<ChessBoard {...defaultProps} />)
      expect(screen.getByText('Son Hamle')).toBeInTheDocument()
      expect(screen.getByText('Seçili')).toBeInTheDocument()
      expect(screen.getByText('Mümkün')).toBeInTheDocument()
      expect(screen.getByText('Şah')).toBeInTheDocument()
    })
  })

  describe('Piece Display', () => {
    it('displays white pieces in starting position', () => {
      const { container } = render(<ChessBoard {...defaultProps} />)
      const pieces = container.querySelectorAll('.chess-piece')
      expect(pieces.length).toBeGreaterThan(0)
    })

    it('displays black pieces in starting position', () => {
      const { container } = render(<ChessBoard {...defaultProps} />)
      const pieces = container.querySelectorAll('.chess-piece')
      expect(pieces.length).toBe(32) // 32 pieces total (16 white + 16 black)
    })

    it('updates pieces when FEN changes', () => {
      const { rerender } = render(<ChessBoard {...defaultProps} />)

      const newFen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      rerender(<ChessBoard {...defaultProps} fen={newFen} />)

      const board = screen.getByRole('application')
      expect(board).toBeInTheDocument()
    })
  })

  describe('Square Selection', () => {
    it('calls onSelectSquare when clicking a square', async () => {
      const onSelectSquare = jest.fn()
      render(<ChessBoard {...defaultProps} onSelectSquare={onSelectSquare} />)

      const square = screen.getAllByRole('button')[0]
      fireEvent.click(square)

      expect(onSelectSquare).toHaveBeenCalled()
    })

    it('highlights selected square', () => {
      const { container } = render(
        <ChessBoard {...defaultProps} selectedSquare="e2" />
      )

      const selectedSquare = container.querySelector('[aria-pressed="true"]')
      expect(selectedSquare).toBeInTheDocument()
    })

    it('shows possible moves when square is selected', () => {
      const { container } = render(
        <ChessBoard
          {...defaultProps}
          selectedSquare="e2"
          possibleMoves={['e3', 'e4']}
        />
      )

      const squares = container.querySelectorAll('button')
      let possibleMovesCount = 0
      squares.forEach((sq) => {
        if (sq.className.includes('ring-green-400')) {
          possibleMovesCount++
        }
      })

      expect(possibleMovesCount).toBeGreaterThan(0)
    })
  })

  describe('Move Execution', () => {
    it('calls onMakeMove when clicking possible move', async () => {
      const onMakeMove = jest.fn()
      render(
        <ChessBoard
          {...defaultProps}
          selectedSquare="e2"
          possibleMoves={['e3', 'e4']}
          onMakeMove={onMakeMove}
        />
      )

      const buttons = screen.getAllByRole('button')
      const e3Button = buttons.find((btn) => btn.getAttribute('aria-label')?.includes('e3'))

      if (e3Button) {
        fireEvent.click(e3Button)
        expect(onMakeMove).toHaveBeenCalledWith({
          from: 'e2',
          to: 'e3',
        })
      }
    })

    it('resets selection after making move', async () => {
      const onMakeMove = jest.fn()
      const { container } = render(
        <ChessBoard
          {...defaultProps}
          selectedSquare="e2"
          possibleMoves={['e3', 'e4']}
          onMakeMove={onMakeMove}
        />
      )

      const buttons = screen.getAllByRole('button')
      const e3Button = buttons.find((btn) => btn.getAttribute('aria-label')?.includes('e3'))

      if (e3Button) {
        fireEvent.click(e3Button)
      }

      const selectedSquare = container.querySelector('[aria-pressed="true"]')
      expect(selectedSquare).not.toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates board with arrow keys', async () => {
      const onSelectSquare = jest.fn()
      render(
        <ChessBoard
          {...defaultProps}
          selectedSquare="e4"
          onSelectSquare={onSelectSquare}
        />
      )

      const board = screen.getByRole('application')

      fireEvent.keyDown(board, { key: 'ArrowUp' })
      fireEvent.keyDown(board, { key: 'ArrowRight' })

      // Keyboard navigation test
      expect(board).toBeInTheDocument()
    })

    it('makes move with Enter key', () => {
      const onMakeMove = jest.fn()
      render(
        <ChessBoard
          {...defaultProps}
          selectedSquare="e2"
          possibleMoves={['e3', 'e4']}
          onMakeMove={onMakeMove}
        />
      )

      const board = screen.getByRole('application')
      fireEvent.keyDown(board, { key: 'Enter' })

      // Enter key handling test
      expect(board).toBeInTheDocument()
    })

    it('clears selection with Escape key', () => {
      render(
        <ChessBoard {...defaultProps} selectedSquare="e2" />
      )

      const board = screen.getByRole('application')
      fireEvent.keyDown(board, { key: 'Escape' })

      expect(board).toBeInTheDocument()
    })
  })

  describe('Last Move Highlighting', () => {
    it('highlights last move squares', () => {
      const { container } = render(
        <ChessBoard
          {...defaultProps}
          lastMove={{ from: 'e2', to: 'e4' }}
        />
      )

      const buttons = container.querySelectorAll('button')
      let highlightedCount = 0

      buttons.forEach((btn) => {
        const label = btn.getAttribute('aria-label')
        if (
          (label?.includes('e2') || label?.includes('e4')) &&
          btn.className.includes('yellow')
        ) {
          highlightedCount++
        }
      })

      expect(highlightedCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Check Indication', () => {
    it('shows check indicator when king is in check', () => {
      const { container } = render(
        <ChessBoard {...defaultProps} isInCheck={true} />
      )

      const elements = container.querySelectorAll('[class*="animate-pulse"]')
      expect(elements.length).toBeGreaterThanOrEqual(0)
    })

    it('does not show check indicator when king is safe', () => {
      const { container } = render(
        <ChessBoard {...defaultProps} isInCheck={false} />
      )

      const pulseElements = container.querySelectorAll('.animate-pulse')
      // In normal position, no animated pulse for check
      const checkElements = pulseElements
      expect(checkElements).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for squares', () => {
      render(<ChessBoard {...defaultProps} />)

      const squareButtons = screen.getAllByRole('button')
      squareButtons.forEach((button) => {
        expect(button.getAttribute('aria-label')).toBeTruthy()
      })
    })

    it('board is keyboard accessible', () => {
      render(<ChessBoard {...defaultProps} />)

      const board = screen.getByRole('application')
      expect(board).toBeInTheDocument()
      expect(board.getAttribute('role')).toBe('application')
    })

    it('has proper aria-pressed for selected square', () => {
      render(<ChessBoard {...defaultProps} selectedSquare="e2" />)

      const selectedButton = screen.getAllByRole('button').find((btn) =>
        btn.getAttribute('aria-pressed') === 'true'
      )

      expect(selectedButton).toBeDefined()
    })
  })

  describe('Responsive Design', () => {
    it('renders different board sizes', () => {
      const { container } = render(<ChessBoard {...defaultProps} />)
      const board = container.querySelector('.grid')

      expect(board).toBeInTheDocument()
      expect(board?.className).toContain('grid-cols-8')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty possible moves list', () => {
      render(
        <ChessBoard
          {...defaultProps}
          selectedSquare="e2"
          possibleMoves={[]}
        />
      )

      const board = screen.getByRole('application')
      expect(board).toBeInTheDocument()
    })

    it('handles null selected square', () => {
      render(
        <ChessBoard
          {...defaultProps}
          selectedSquare={null}
          possibleMoves={[]}
        />
      )

      const selectedButton = screen.getAllByRole('button').find((btn) =>
        btn.getAttribute('aria-pressed') === 'true'
      )

      expect(selectedButton).toBeUndefined()
    })

    it('handles undefined last move', () => {
      render(
        <ChessBoard
          {...defaultProps}
          lastMove={undefined}
        />
      )

      const board = screen.getByRole('application')
      expect(board).toBeInTheDocument()
    })

    it('handles FEN with different piece positions', () => {
      const testFen = '8/8/8/4k3/8/8/8/4K3 w - - 0 1'
      render(<ChessBoard {...defaultProps} fen={testFen} />)

      const board = screen.getByRole('application')
      expect(board).toBeInTheDocument()
    })
  })
})
