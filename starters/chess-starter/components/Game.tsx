'use client'

import React from 'react'
import { useGame } from '@/hooks/useGame'
import { ChessBoard } from './ChessBoard'
import { GameControls } from './GameControls'
import { MoveHistory } from './MoveHistory'

export const Game: React.FC = () => {
  const { gameState, makeMove, selectSquare, clearSelection, resetGame, undoMove } = useGame()

  const handleSquareSelect = (square: string) => {
    if (gameState.selectedSquare === square) {
      clearSelection()
    } else {
      selectSquare(square)
    }
  }

  const handleMoveMade = (move: { from: string; to: string }) => {
    const success = makeMove(move)
    if (success) {
      clearSelection()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Chess Board */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 flex justify-center">
          <ChessBoard
            fen={gameState.fen}
            selectedSquare={gameState.selectedSquare}
            possibleMoves={gameState.possibleMoves}
            onSelectSquare={handleSquareSelect}
            onMakeMove={handleMoveMade}
          />
        </div>
      </div>

      {/* Side Panel: Controls & History */}
      <div className="space-y-6">
        {/* Controls */}
        <GameControls
          turn={gameState.turn}
          gameStatus={gameState.gameStatus}
          moveCount={gameState.history.length}
          onReset={resetGame}
          onUndo={undoMove}
        />

        {/* Move History */}
        <MoveHistory history={gameState.history} />
      </div>
    </div>
  )
}
