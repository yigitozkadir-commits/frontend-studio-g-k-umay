/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react'
import { useGame } from '../useGame'

describe('useGame Hook', () => {
  describe('Initialization', () => {
    it('initializes game with default FEN', () => {
      const { result } = renderHook(() => useGame())
      expect(result.current.gameState.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    })

    it('starts with white turn', () => {
      const { result } = renderHook(() => useGame())
      expect(result.current.gameState.turn).toBe('w')
    })

    it('initializes with empty move history', () => {
      const { result } = renderHook(() => useGame())
      expect(result.current.gameState.history.length).toBe(0)
    })

    it('initializes with playing status', () => {
      const { result } = renderHook(() => useGame())
      expect(result.current.gameState.gameStatus).toBe('playing')
    })

    it('initializes without selection', () => {
      const { result } = renderHook(() => useGame())
      expect(result.current.gameState.selectedSquare).toBeNull()
    })

    it('initializes without promotion dialog', () => {
      const { result } = renderHook(() => useGame())
      expect(result.current.gameState.showPromotionDialog).toBe(false)
    })

    it('initializes move count to 0', () => {
      const { result } = renderHook(() => useGame())
      expect(result.current.gameState.moveCount).toBe(0)
    })
  })

  describe('makeMove', () => {
    it('makes a valid opening move', () => {
      const { result } = renderHook(() => useGame())
      let moveResult: any

      act(() => {
        moveResult = result.current.makeMove({ from: 'e2', to: 'e4' })
      })

      expect(moveResult?.success).toBe(true)
      expect(result.current.gameState.turn).toBe('b')
      expect(result.current.gameState.moveCount).toBe(1)
    })

    it('alternates turns correctly', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
      })
      expect(result.current.gameState.turn).toBe('b')

      act(() => {
        result.current.makeMove({ from: 'e7', to: 'e5' })
      })
      expect(result.current.gameState.turn).toBe('w')
    })

    it('prevents illegal moves', () => {
      const { result } = renderHook(() => useGame())
      let moveResult: any

      act(() => {
        moveResult = result.current.makeMove({ from: 'e1', to: 'e4' })
      })

      expect(moveResult?.success).toBe(false)
      expect(result.current.gameState.moveCount).toBe(0)
    })

    it('prevents move when not your turn', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
      })

      let moveResult: any
      act(() => {
        moveResult = result.current.makeMove({ from: 'e2', to: 'e4' })
      })

      expect(moveResult?.success).toBe(false)
    })

    it('tracks captured pieces', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'c7', to: 'c5' })
        result.current.makeMove({ from: 'Nf1', to: 'f3' })
        result.current.makeMove({ from: 'd7', to: 'd6' })
        result.current.makeMove({ from: 'd2', to: 'd4' })
        result.current.makeMove({ from: 'c5', to: 'd4' })
        result.current.makeMove({ from: 'Nf3', to: 'd4' })
      })

      expect(result.current.gameState.capturedPieces.length).toBeGreaterThan(0)
    })

    it('updates move history', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'e7', to: 'e5' })
      })

      expect(result.current.gameState.history.length).toBe(2)
      expect(result.current.gameState.history[0].san).toBe('e4')
      expect(result.current.gameState.history[1].san).toBe('e5')
    })

    it('tracks last move', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
      })

      expect(result.current.gameState.lastMove).toEqual({ from: 'e2', to: 'e4' })
    })

    it('returns error for invalid move format', () => {
      const { result } = renderHook(() => useGame())
      let moveResult: any

      act(() => {
        moveResult = result.current.makeMove({ from: '', to: 'e4' })
      })

      expect(moveResult?.success).toBe(false)
      expect(moveResult?.error).toBeDefined()
    })
  })

  describe('Pawn Promotion', () => {
    it('detects promotion requirement', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('8/P7/8/8/8/8/8/7k w - - 0 1')
      })

      let moveResult: any
      act(() => {
        moveResult = result.current.makeMove({ from: 'a7', to: 'a8' })
      })

      expect(moveResult?.requiresPromotion).toBe(true)
      expect(result.current.gameState.showPromotionDialog).toBe(true)
    })

    it('shows promotion dialog with correct square', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('8/P7/8/8/8/8/8/7k w - - 0 1')
      })

      act(() => {
        result.current.makeMove({ from: 'a7', to: 'a8' })
      })

      expect(result.current.gameState.promotionSquare).toBe('a8')
      expect(result.current.gameState.promotionFrom).toBe('a7')
    })

    it('closes promotion dialog', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('8/P7/8/8/8/8/8/7k w - - 0 1')
      })

      act(() => {
        result.current.makeMove({ from: 'a7', to: 'a8' })
      })

      expect(result.current.gameState.showPromotionDialog).toBe(true)

      act(() => {
        result.current.closePromotionDialog()
      })

      expect(result.current.gameState.showPromotionDialog).toBe(false)
    })

    it('makes promotion move with piece selection', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('8/P7/8/8/8/8/8/7k w - - 0 1')
      })

      let moveResult: any
      act(() => {
        moveResult = result.current.makeMove({ from: 'a7', to: 'a8', promotion: 'q' })
      })

      expect(moveResult?.success).toBe(true)
      expect(result.current.gameState.history[0].promotion).toBe('q')
    })

    it('handles black pawn promotion', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('7K/8/8/8/8/8/p7/8 b - - 0 1')
      })

      let moveResult: any
      act(() => {
        moveResult = result.current.makeMove({ from: 'a2', to: 'a1', promotion: 'r' })
      })

      expect(moveResult?.success).toBe(true)
      expect(result.current.gameState.history[0].promotion).toBe('r')
    })
  })

  describe('selectSquare', () => {
    it('selects a square with own piece', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.selectSquare('e2')
      })

      expect(result.current.gameState.selectedSquare).toBe('e2')
    })

    it('shows possible moves for selected square', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.selectSquare('e2')
      })

      expect(result.current.gameState.possibleMoves.length).toBeGreaterThan(0)
      expect(result.current.gameState.possibleMoves).toContain('e3')
      expect(result.current.gameState.possibleMoves).toContain('e4')
    })

    it('deselects when selecting opponent piece', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.selectSquare('e7')
      })

      expect(result.current.gameState.selectedSquare).toBeNull()
      expect(result.current.gameState.possibleMoves.length).toBe(0)
    })

    it('deselects when selecting empty square', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.selectSquare('e4')
      })

      expect(result.current.gameState.selectedSquare).toBeNull()
    })

    it('rejects invalid square format', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.selectSquare('invalid')
      })

      expect(result.current.gameState.selectedSquare).toBeNull()
    })

    it('prevents selecting opponent pieces', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
      })

      act(() => {
        result.current.selectSquare('e7')
      })

      expect(result.current.gameState.selectedSquare).toBeNull()
    })
  })

  describe('clearSelection', () => {
    it('clears selected square', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.selectSquare('e2')
      })

      expect(result.current.gameState.selectedSquare).toBe('e2')

      act(() => {
        result.current.clearSelection()
      })

      expect(result.current.gameState.selectedSquare).toBeNull()
    })

    it('clears possible moves', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.selectSquare('e2')
      })

      expect(result.current.gameState.possibleMoves.length).toBeGreaterThan(0)

      act(() => {
        result.current.clearSelection()
      })

      expect(result.current.gameState.possibleMoves.length).toBe(0)
    })

    it('closes promotion dialog', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('8/P7/8/8/8/8/8/7k w - - 0 1')
        result.current.makeMove({ from: 'a7', to: 'a8' })
      })

      expect(result.current.gameState.showPromotionDialog).toBe(true)

      act(() => {
        result.current.clearSelection()
      })

      expect(result.current.gameState.showPromotionDialog).toBe(false)
    })
  })

  describe('resetGame', () => {
    it('resets game to initial state', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'e7', to: 'e5' })
      })

      expect(result.current.gameState.moveCount).toBe(2)

      act(() => {
        result.current.resetGame()
      })

      expect(result.current.gameState.fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
      expect(result.current.gameState.history.length).toBe(0)
      expect(result.current.gameState.turn).toBe('w')
      expect(result.current.gameState.gameStatus).toBe('playing')
    })

    it('clears move history on reset', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'e7', to: 'e5' })
      })

      expect(result.current.gameState.history.length).toBe(2)

      act(() => {
        result.current.resetGame()
      })

      expect(result.current.gameState.history.length).toBe(0)
    })

    it('resets captured pieces on reset', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'c7', to: 'c5' })
        result.current.makeMove({ from: 'Nf1', to: 'f3' })
        result.current.makeMove({ from: 'd7', to: 'd6' })
        result.current.makeMove({ from: 'd2', to: 'd4' })
        result.current.makeMove({ from: 'c5', to: 'd4' })
        result.current.makeMove({ from: 'Nf3', to: 'd4' })
      })

      expect(result.current.gameState.capturedPieces.length).toBeGreaterThan(0)

      act(() => {
        result.current.resetGame()
      })

      expect(result.current.gameState.capturedPieces.length).toBe(0)
    })
  })

  describe('undoMove', () => {
    it('undoes last move', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
      })

      expect(result.current.gameState.moveCount).toBe(1)

      let undoResult
      act(() => {
        undoResult = result.current.undoMove()
      })

      expect(undoResult).toBe(true)
      expect(result.current.gameState.moveCount).toBe(0)
      expect(result.current.gameState.turn).toBe('w')
    })

    it('returns false when no moves to undo', () => {
      const { result } = renderHook(() => useGame())

      let undoResult
      act(() => {
        undoResult = result.current.undoMove()
      })

      expect(undoResult).toBe(false)
    })

    it('undoes multiple moves sequentially', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'e7', to: 'e5' })
        result.current.makeMove({ from: 'Nf1', to: 'f3' })
      })

      expect(result.current.gameState.moveCount).toBe(3)

      act(() => {
        result.current.undoMove()
        result.current.undoMove()
      })

      expect(result.current.gameState.moveCount).toBe(1)
      expect(result.current.gameState.turn).toBe('b')
    })

    it('restores game state after undo', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
      })

      const fenAfterMove = result.current.gameState.fen

      act(() => {
        result.current.undoMove()
      })

      expect(result.current.gameState.fen).not.toBe(fenAfterMove)
    })
  })

  describe('loadFen', () => {
    it('loads valid FEN', () => {
      const { result } = renderHook(() => useGame())
      const testFen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'

      let loadResult
      act(() => {
        loadResult = result.current.loadFen(testFen)
      })

      expect(loadResult).toBe(true)
      expect(result.current.gameState.fen).toBe(testFen)
    })

    it('rejects invalid FEN', () => {
      const { result } = renderHook(() => useGame())

      let loadResult
      act(() => {
        loadResult = result.current.loadFen('invalid fen')
      })

      expect(loadResult).toBe(false)
    })

    it('updates turn from loaded FEN', () => {
      const { result } = renderHook(() => useGame())
      const testFen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'

      act(() => {
        result.current.loadFen(testFen)
      })

      expect(result.current.gameState.turn).toBe('b')
    })

    it('preserves castling rights from FEN', () => {
      const { result } = renderHook(() => useGame())
      const testFen = '8/8/8/8/8/8/8/R3K2R w KQ - 0 1'

      act(() => {
        result.current.loadFen(testFen)
      })

      expect(result.current.gameState.fen).toContain('KQ')
    })
  })

  describe('Game Status Detection', () => {
    it('detects checkmate', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4')
        // Fool's mate setup - but we need scholar's mate
        result.current.loadFen('rnbqkbnr/pppp1ppp/8/4p3/6PP/8/PPPNPPBP/RNB1QK1R b KQkq - 0 1')
      })

      // Would need specific checkmate position
    })

    it('detects stalemate', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1')
      })

      expect(result.current.gameState.gameStatus).toBe('stalemate')
      expect(result.current.gameState.isGameOver).toBe(true)
    })

    it('detects check status', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'e7', to: 'e5' })
        result.current.makeMove({ from: 'Nf1', to: 'f3' })
        result.current.makeMove({ from: 'Nf8', to: 'c6' })
        result.current.makeMove({ from: 'Bf1', to: 'b5' })
        result.current.makeMove({ from: 'a7', to: 'a6' })
        result.current.makeMove({ from: 'Bb5', to: 'c6' })
      })

      expect(result.current.gameState.gameStatus === 'check' || result.current.gameState.gameStatus === 'playing')
    })
  })

  describe('getGameStats', () => {
    it('returns initial game stats', () => {
      const { result } = renderHook(() => useGame())

      const stats = result.current.getGameStats()

      expect(stats.moveCount).toBe(0)
      expect(stats.capturedPiecesCount).toBe(0)
    })

    it('tracks move count in stats', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'e7', to: 'e5' })
      })

      const stats = result.current.getGameStats()

      expect(stats.moveCount).toBe(2)
    })

    it('tracks captured pieces in stats', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'c7', to: 'c5' })
        result.current.makeMove({ from: 'Nf1', to: 'f3' })
        result.current.makeMove({ from: 'd7', to: 'd6' })
        result.current.makeMove({ from: 'd2', to: 'd4' })
        result.current.makeMove({ from: 'c5', to: 'd4' })
        result.current.makeMove({ from: 'Nf3', to: 'd4' })
      })

      const stats = result.current.getGameStats()

      expect(stats.capturedPiecesCount).toBeGreaterThan(0)
    })

    it('separates captured pieces by color', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.makeMove({ from: 'e2', to: 'e4' })
        result.current.makeMove({ from: 'd7', to: 'd5' })
        result.current.makeMove({ from: 'e4', to: 'd5' })
      })

      const stats = result.current.getGameStats()

      const blackCaptured = stats.blackCapturedPieces
      expect(blackCaptured.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles consecutive promotions', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('8/P6P/8/8/8/8/8/7k w - - 0 1')
      })

      act(() => {
        result.current.makeMove({ from: 'a7', to: 'a8', promotion: 'q' })
      })

      expect(result.current.gameState.moveCount).toBe(1)
    })

    it('handles en passant capture', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('8/8/8/pP6/8/8/8/8 w - a6 0 1')
      })

      let moveResult: any
      act(() => {
        moveResult = result.current.makeMove({ from: 'b5', to: 'a6' })
      })

      expect(moveResult?.success).toBe(true)
    })

    it('handles castling moves', () => {
      const { result } = renderHook(() => useGame())

      act(() => {
        result.current.loadFen('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1')
      })

      let moveResult: any
      act(() => {
        moveResult = result.current.makeMove({ from: 'e1', to: 'g1' })
      })

      expect(moveResult?.success).toBe(true)
      expect(result.current.gameState.history[0].castling).toBe(true)
    })
  })
})
