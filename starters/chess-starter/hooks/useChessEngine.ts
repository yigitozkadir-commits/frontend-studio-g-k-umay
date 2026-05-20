import { useCallback } from 'react'
import { Chess } from 'chess.js'

export const useChessEngine = (initialFen?: string) => {
  const chess = new Chess(initialFen)

  const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    try {
      const result = chess.move(move, { sloppy: true })
      return { success: !!result, move: result, fen: chess.fen() }
    } catch (error) {
      return { success: false, move: null, fen: chess.fen() }
    }
  }, [chess])

  const getMoves = useCallback((square?: string) => {
    if (square) {
      return chess.moves({ square, verbose: true })
    }
    return chess.moves({ verbose: true })
  }, [chess])

  const isGameOver = useCallback(() => {
    return chess.game_over()
  }, [chess])

  const isCheck = useCallback(() => {
    return chess.in_check()
  }, [chess])

  const isCheckmate = useCallback(() => {
    return chess.in_checkmate()
  }, [chess])

  const isStalemate = useCallback(() => {
    return chess.in_stalemate()
  }, [chess])

  const getTurn = useCallback(() => {
    return chess.turn()
  }, [chess])

  const getHistory = useCallback(() => {
    return chess.history({ verbose: true })
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

  return {
    makeMove,
    getMoves,
    isGameOver,
    isCheck,
    isCheckmate,
    isStalemate,
    getTurn,
    getHistory,
    reset,
    undo,
    getFen,
    chess,
  }
}
