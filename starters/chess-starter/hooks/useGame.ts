'use client'

import { useState, useCallback, useEffect } from 'react'
import { Chess } from 'chess.js'

interface GameState {
  fen: string
  history: Array<{ from: string; to: string; san: string; piece: string }>
  selectedSquare: string | null
  possibleMoves: string[]
  turn: 'w' | 'b'
  isGameOver: boolean
  gameStatus: 'playing' | 'checkmate' | 'stalemate' | 'check'
}

export const useGame = () => {
  const [game] = useState(() => new Chess())
  const [gameState, setGameState] = useState<GameState>(() => ({
    fen: game.fen(),
    history: [],
    selectedSquare: null,
    possibleMoves: [],
    turn: 'w',
    isGameOver: false,
    gameStatus: 'playing',
  }))

  const updateGameState = useCallback(() => {
    setGameState({
      fen: game.fen(),
      history: game.history({ verbose: true }).map((move: any) => ({
        from: move.from,
        to: move.to,
        san: move.san,
        piece: move.piece,
      })),
      selectedSquare: null,
      possibleMoves: [],
      turn: game.turn() as 'w' | 'b',
      isGameOver: game.game_over(),
      gameStatus: getGameStatus(game),
    })
  }, [game])

  const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    try {
      const result = game.move(move, { sloppy: true })
      if (result) {
        updateGameState()
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }, [game, updateGameState])

  const selectSquare = useCallback((square: string) => {
    try {
      const moves = game.moves({ square, verbose: true })
      const possibleSquares = moves.map((move: any) => move.to)
      
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
  }, [game])

  const clearSelection = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      selectedSquare: null,
      possibleMoves: [],
    }))
  }, [])

  const resetGame = useCallback(() => {
    game.reset()
    updateGameState()
  }, [game, updateGameState])

  const undoMove = useCallback(() => {
    game.undo()
    updateGameState()
  }, [game, updateGameState])

  return {
    gameState,
    makeMove,
    selectSquare,
    clearSelection,
    resetGame,
    undoMove,
  }
}

function getGameStatus(game: Chess): 'playing' | 'checkmate' | 'stalemate' | 'check' {
  if (game.in_checkmate()) return 'checkmate'
  if (game.in_stalemate()) return 'stalemate'
  if (game.in_check()) return 'check'
  return 'playing'
}
