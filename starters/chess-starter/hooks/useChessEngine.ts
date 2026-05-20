import { useCallback, useMemo } from 'react'
import { Chess, Move } from 'chess.js'

interface GameStateInfo {
  turn: 'w' | 'b'
  fen: string
  capturedPieces: Array<{ piece: string; color: 'w' | 'b'; moveNumber: number }>
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  isDraw: boolean
  isGameOver: boolean
  moveCount: number
  halfmoveClock: number
  fullmoveNumber: number
  legalMoveCount: number
}

interface MoveValidationResult {
  isValid: boolean
  requiresPromotion: boolean
  isCapture: boolean
  isCastling: boolean
  isEnPassant: boolean
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  promotionPieces?: string[]
}

export const useChessEngine = (initialFen?: string) => {
  const chess = useMemo(() => {
    if (initialFen) {
      return new Chess(initialFen)
    }
    return new Chess()
  }, [initialFen])

  const makeMove = useCallback(
    (move: { from: string; to: string; promotion?: string }) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (chess.move as any)(move)
        return { success: !!result, move: result, fen: chess.fen() }
      } catch (error) {
        return { success: false, move: null, fen: chess.fen() }
      }
    },
    [chess]
  )

  const getMoves = useCallback(
    (square?: string) => {
      if (square) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (chess.moves as any)({ square, verbose: true })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (chess.moves as any)({ verbose: true })
    },
    [chess]
  )

  const getPossibleMovesForPiece = useCallback(
    (square: string): Move[] => {
      try {
        // Validate square format
        if (!square || square.length !== 2) return []

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const piece = (chess.get as any)(square)
        if (!piece) return []

        // Validate it's the correct color for current turn
        if (piece.color !== chess.turn()) return []

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (chess.moves as any)({ square, verbose: true })
      } catch {
        return []
      }
    },
    [chess]
  )

  const isValidMove = useCallback(
    (move: { from: string; to: string; promotion?: string }): boolean => {
      try {
        // Make a copy to test the move without affecting game state
        const testChess = new Chess(chess.fen())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (testChess.move as any)(move)
        return !!result
      } catch {
        return false
      }
    },
    [chess]
  )

  const validateMove = useCallback(
    (move: { from: string; to: string; promotion?: string }): MoveValidationResult => {
      try {
        // Make a test copy
        const testChess = new Chess(chess.fen())

        // Check if promotion is required
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const piece = (testChess.get as any)(move.from)
        const requiresPromotion =
          piece &&
          piece.type === 'p' &&
          ((piece.color === 'w' && move.to[1] === '8') ||
            (piece.color === 'b' && move.to[1] === '1'))

        if (requiresPromotion && !move.promotion) {
          return {
            isValid: false,
            requiresPromotion: true,
            isCapture: false,
            isCastling: false,
            isEnPassant: false,
            isCheck: false,
            isCheckmate: false,
            isStalemate: false,
            promotionPieces: ['q', 'r', 'b', 'n'],
          }
        }

        // Try the move
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (testChess.move as any)(move)
        if (!result) {
          return {
            isValid: false,
            requiresPromotion: false,
            isCapture: false,
            isCastling: false,
            isEnPassant: false,
            isCheck: false,
            isCheckmate: false,
            isStalemate: false,
          }
        }

        return {
          isValid: true,
          requiresPromotion: false,
          isCapture: !!result.captured,
          isCastling: result.flags.includes('k') || result.flags.includes('q'),
          isEnPassant: result.flags.includes('e'),
          isCheck: result.flags.includes('+'),
          isCheckmate: result.flags.includes('#'),
          isStalemate: testChess.isStalemate(),
        }
      } catch {
        return {
          isValid: false,
          requiresPromotion: false,
          isCapture: false,
          isCastling: false,
          isEnPassant: false,
          isCheck: false,
          isCheckmate: false,
          isStalemate: false,
        }
      }
    },
    [chess]
  )

  const getGameState = useCallback((): GameStateInfo => {
    const fen = chess.fen()
    const fenParts = fen.split(' ')
    const fullmoveNumber = parseInt(fenParts[5] || '1')
    const halfmoveClock = parseInt(fenParts[4] || '0')

    // Calculate captured pieces with move numbers
    const capturedPieces: Array<{ piece: string; color: 'w' | 'b'; moveNumber: number }> = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const history = (chess.history as any)({ verbose: true })

    history.forEach((move: Move, index: number) => {
      if (move.captured) {
        const moveNumber = Math.floor(index / 2) + 1
        const captureColor = move.color === 'w' ? 'b' : 'w'
        capturedPieces.push({
          piece: move.captured,
          color: captureColor,
          moveNumber,
        })
      }
    })

    // Get all legal moves count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const legalMoves = (chess.moves as any)({ verbose: true })

    return {
      turn: chess.turn() as 'w' | 'b',
      fen,
      capturedPieces,
      isCheck: chess.inCheck(),
      isCheckmate: chess.isCheckmate(),
      isStalemate: chess.isStalemate(),
      isDraw: chess.isDraw(),
      isGameOver: chess.isGameOver(),
      moveCount: history.length,
      halfmoveClock,
      fullmoveNumber,
      legalMoveCount: legalMoves.length,
    }
  }, [chess])

  const exportPGN = useCallback(
    (options?: {
      event?: string
      site?: string
      white?: string
      black?: string
      round?: string
    }): string => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const history = (chess.history as any)({ verbose: true })
      const gameState = getGameState()

      const event = options?.event || 'Casual Game'
      const site = options?.site || 'Chess App'
      const white = options?.white || 'White'
      const black = options?.black || 'Black'
      const round = options?.round || '1'

      // Build PGN header
      let pgn = `[Event "${event}"]\n`
      pgn += `[Site "${site}"]\n`
      pgn += `[Date "${new Date().toISOString().split('T')[0]}"]\n`
      pgn += `[Round "${round}"]\n`
      pgn += `[White "${white}"]\n`
      pgn += `[Black "${black}"]\n`

      // Add result
      if (gameState.isCheckmate) {
        pgn += `[Result "${gameState.turn === 'w' ? '0-1' : '1-0'}"]\n`
      } else if (gameState.isStalemate || gameState.isDraw) {
        pgn += '[Result "1/2-1/2"]\n'
      } else {
        pgn += '[Result "*"]\n'
      }

      pgn += '\n'

      // Build moves with proper PGN formatting
      let moveText = ''
      for (let i = 0; i < history.length; i++) {
        if (i % 2 === 0) {
          const moveNumber = Math.floor(i / 2) + 1
          moveText += `${moveNumber}. `
        }
        moveText += history[i].san
        if (i % 2 === 1) {
          moveText += ' '
        } else {
          moveText += ' '
        }
      }

      // Add game result at the end
      if (gameState.isCheckmate) {
        moveText += gameState.turn === 'w' ? '0-1' : '1-0'
      } else if (gameState.isStalemate || gameState.isDraw) {
        moveText += '1/2-1/2'
      } else {
        moveText += '*'
      }

      pgn += moveText.trim()

      return pgn
    },
    [chess, getGameState]
  )

  const isGameOver = useCallback(() => {
    return chess.isGameOver()
  }, [chess])

  const isCheck = useCallback(() => {
    return chess.inCheck()
  }, [chess])

  const isCheckmate = useCallback(() => {
    return chess.isCheckmate()
  }, [chess])

  const isStalemate = useCallback(() => {
    return chess.isStalemate()
  }, [chess])

  const isDraw = useCallback(() => {
    return chess.isDraw()
  }, [chess])

  const getTurn = useCallback(() => {
    return chess.turn()
  }, [chess])

  const getHistory = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (chess.history as any)({ verbose: true })
  }, [chess])

  const getHistoryInSan = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (chess.history as any)()
  }, [chess])

  const reset = useCallback(() => {
    chess.reset()
    return { fen: chess.fen(), moves: chess.moves({ verbose: true }) }
  }, [chess])

  const undo = useCallback(() => {
    const result = chess.undo()
    return { success: !!result, fen: chess.fen() }
  }, [chess])

  const getFen = useCallback(() => {
    return chess.fen()
  }, [chess])

  const load = useCallback((fen: string): boolean => {
    try {
      chess.load(fen)
      return true
    } catch {
      return false
    }
  }, [chess])

  return {
    makeMove,
    getMoves,
    getPossibleMovesForPiece,
    isValidMove,
    validateMove,
    getGameState,
    exportPGN,
    isGameOver,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    getTurn,
    getHistory,
    getHistoryInSan,
    reset,
    undo,
    getFen,
    load,
    chess,
  }
}
