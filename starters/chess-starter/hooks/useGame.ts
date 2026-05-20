'use client'

import { useState, useCallback } from 'react'
import { Chess, Move } from 'chess.js'

interface CapturedPiece {
  piece: string
  color: 'w' | 'b'
  moveNumber: number
  turn: number
}

interface GameMove {
  from: string
  to: string
  san: string
  piece: string
  captured?: string
  promotion?: string
  castling?: boolean
  enPassant?: boolean
  check?: boolean
  checkmate?: boolean
  stalemate?: boolean
}

interface GameState {
  fen: string
  history: GameMove[]
  capturedPieces: CapturedPiece[]
  selectedSquare: string | null
  possibleMoves: string[]
  turn: 'w' | 'b'
  isGameOver: boolean
  gameStatus: 'playing' | 'checkmate' | 'stalemate' | 'check' | 'draw'
  showPromotionDialog: boolean
  promotionSquare?: string
  promotionFrom?: string
  lastMove?: { from: string; to: string }
  moveCount: number
  whiteTimeMs?: number
  blackTimeMs?: number
}

export const useGame = () => {
  const [game] = useState(() => new Chess())
  const [gameState, setGameState] = useState<GameState>(() => ({
    fen: game.fen(),
    history: [],
    capturedPieces: [],
    selectedSquare: null,
    possibleMoves: [],
    turn: 'w',
    isGameOver: false,
    gameStatus: 'playing',
    showPromotionDialog: false,
    moveCount: 0,
  }))

  const updateGameState = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawHistory = (game.history as any)({ verbose: true })
    const history: GameMove[] = rawHistory.map((move: Move) => ({
      from: move.from,
      to: move.to,
      san: move.san || '',
      piece: move.piece,
      captured: move.captured,
      promotion: move.promotion,
      castling: isCastling(move),
      enPassant: isEnPassant(move),
      check: move.flags.includes('+'),
      checkmate: move.flags.includes('#'),
      stalemate: false, // Will be set based on game state after move
    }))

    // Extract captured pieces with improved tracking
    const capturedPieces: CapturedPiece[] = []
    history.forEach((move, index) => {
      if (move.captured) {
        // Determine who captured the piece based on move history
        const moveNumber = Math.floor(index / 2) + 1
        const isWhiteMove = index % 2 === 0
        const capturedColor = isWhiteMove ? 'b' : 'w'

        capturedPieces.push({
          piece: move.captured,
          color: capturedColor,
          moveNumber,
          turn: index + 1,
        })
      }
    })

    const lastMove = history.length > 0 ? {
      from: history[history.length - 1].from,
      to: history[history.length - 1].to,
    } : undefined

    const gameStatus = getGameStatus(game)

    setGameState({
      fen: game.fen(),
      history,
      capturedPieces,
      selectedSquare: null,
      possibleMoves: [],
      turn: game.turn() as 'w' | 'b',
      isGameOver: game.isGameOver(),
      gameStatus,
      showPromotionDialog: false,
      lastMove,
      moveCount: history.length,
    })
  }, [game])

  const makeMove = useCallback(
    (move: { from: string; to: string; promotion?: string }) => {
      try {
        // Validate turn
        if (gameState.turn !== game.turn()) {
          return { success: false, requiresPromotion: false, error: 'Invalid turn' }
        }

        // Validate move format
        if (!move.from || !move.to) {
          return { success: false, requiresPromotion: false, error: 'Invalid move format' }
        }

        // Check if move requires promotion
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const piece = (game.get as any)(move.from)
        if (
          piece &&
          piece.type === 'p' &&
          ((piece.color === 'w' && move.to[1] === '8') ||
            (piece.color === 'b' && move.to[1] === '1'))
        ) {
          if (!move.promotion) {
            setGameState((prev) => ({
              ...prev,
              showPromotionDialog: true,
              promotionSquare: move.to,
              promotionFrom: move.from,
              selectedSquare: move.from,
            }))
            return { success: false, requiresPromotion: true, error: 'Promotion required' }
          }
        }

        // Execute move
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (game.move as any)(move)
        if (result) {
          updateGameState()
          return { success: true, requiresPromotion: false, move: result }
        }
        return { success: false, requiresPromotion: false, error: 'Illegal move' }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        return { success: false, requiresPromotion: false, error: errorMsg }
      }
    },
    [game, gameState.turn, updateGameState]
  )

  const selectSquare = useCallback(
    (square: string) => {
      try {
        // Validate square format
        if (!square || square.length !== 2) {
          setGameState((prev) => ({
            ...prev,
            selectedSquare: null,
            possibleMoves: [],
          }))
          return
        }

        // Validate it's player's turn and square has their piece
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const piece = (game.get as any)(square)
        if (!piece || piece.color !== game.turn()) {
          setGameState((prev) => ({
            ...prev,
            selectedSquare: null,
            possibleMoves: [],
          }))
          return
        }

        // Get valid moves for this piece
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const moves = (game.moves as any)({ square, verbose: true })
        const possibleSquares = moves.map((move: Move) => move.to)

        setGameState((prev) => ({
          ...prev,
          selectedSquare: square,
          possibleMoves: possibleSquares,
        }))
      } catch (error) {
        setGameState((prev) => ({
          ...prev,
          selectedSquare: null,
          possibleMoves: [],
        }))
      }
    },
    [game]
  )

  const clearSelection = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      selectedSquare: null,
      possibleMoves: [],
      showPromotionDialog: false,
      promotionSquare: undefined,
      promotionFrom: undefined,
    }))
  }, [])

  const closePromotionDialog = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      showPromotionDialog: false,
      promotionSquare: undefined,
      promotionFrom: undefined,
    }))
  }, [])

  const resetGame = useCallback(() => {
    game.reset()
    updateGameState()
  }, [game, updateGameState])

  const undoMove = useCallback(() => {
    if (gameState.history.length > 0) {
      const result = game.undo()
      if (result) {
        updateGameState()
        return true
      }
    }
    return false
  }, [game, gameState.history.length, updateGameState])

  const loadFen = useCallback(
    (fen: string): boolean => {
      try {
        game.load(fen)
        updateGameState()
        return true
      } catch {
        return false
      }
    },
    [game, updateGameState]
  )

  const getGameStats = useCallback(() => {
    return {
      moveCount: gameState.moveCount,
      capturedPiecesCount: gameState.capturedPieces.length,
      whiteCapturedPieces: gameState.capturedPieces.filter(p => p.color === 'w'),
      blackCapturedPieces: gameState.capturedPieces.filter(p => p.color === 'b'),
    }
  }, [gameState])

  return {
    gameState,
    makeMove,
    selectSquare,
    clearSelection,
    closePromotionDialog,
    resetGame,
    undoMove,
    loadFen,
    getGameStats,
  }
}

function getGameStatus(game: Chess): 'playing' | 'checkmate' | 'stalemate' | 'check' | 'draw' {
  if (game.isCheckmate()) return 'checkmate'
  if (game.isStalemate()) return 'stalemate'
  if (game.isDraw()) return 'draw'
  if (game.inCheck()) return 'check'
  return 'playing'
}

function isCastling(move: Move): boolean {
  return move.flags.includes('k') || move.flags.includes('q')
}

function isEnPassant(move: Move): boolean {
  return move.flags.includes('e')
}
