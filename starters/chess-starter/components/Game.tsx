'use client'

import React, { useCallback } from 'react'
import { useGame } from '@/hooks/useGame'
import { ChessBoard } from './ChessBoard'
import { GameControls } from './GameControls'
import { MoveHistory } from './MoveHistory'
import { PromotionDialog } from './PromotionDialog'

export const Game: React.FC = () => {
  const {
    gameState,
    makeMove,
    selectSquare,
    clearSelection,
    closePromotionDialog,
    resetGame,
    undoMove,
  } = useGame()

  const handleSquareSelect = useCallback(
    (square: string) => {
      if (gameState.selectedSquare === square) {
        clearSelection()
      } else {
        selectSquare(square)
      }
    },
    [gameState.selectedSquare, clearSelection, selectSquare]
  )

  const handleMoveMade = useCallback(
    (move: { from: string; to: string }) => {
      const result = makeMove(move)
      if (result.success) {
        clearSelection()
      }
    },
    [makeMove, clearSelection]
  )

  const handlePromotion = useCallback(
    (piece: string) => {
      if (gameState.selectedSquare && gameState.promotionSquare) {
        const result = makeMove({
          from: gameState.selectedSquare,
          to: gameState.promotionSquare,
          promotion: piece,
        })
        if (result.success) {
          clearSelection()
        }
      }
    },
    [gameState.selectedSquare, gameState.promotionSquare, makeMove, clearSelection]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header with Animation */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2 drop-shadow-sm">
            ♔ Chess Game ♚
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            İki oyunculu profesyonel satranç oyunu
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Chess Board - Left/Top */}
          <div className="lg:col-span-2">
            <div className="chess-panel flex flex-col items-center gap-4">
              <ChessBoard
                fen={gameState.fen}
                selectedSquare={gameState.selectedSquare}
                possibleMoves={gameState.possibleMoves}
                lastMove={gameState.lastMove}
                isInCheck={gameState.gameStatus === 'check'}
                onSelectSquare={handleSquareSelect}
                onMakeMove={handleMoveMade}
              />
            </div>
          </div>

          {/* Side Panel: Controls & History - Right/Bottom */}
          <div className="space-y-6">
            {/* Game Controls */}
            <GameControls
              turn={gameState.turn}
              gameStatus={gameState.gameStatus}
              moveCount={gameState.history.length}
              capturedPieces={gameState.capturedPieces}
              onReset={resetGame}
              onUndo={undoMove}
            />

            {/* Move History */}
            <MoveHistory
              history={gameState.history}
              currentMoveIndex={gameState.history.length - 1}
            />
          </div>
        </div>

        {/* Promotion Dialog */}
        <PromotionDialog
          isOpen={gameState.showPromotionDialog}
          color={gameState.turn === 'w' ? 'b' : 'w'}
          onPromote={handlePromotion}
          onCancel={closePromotionDialog}
        />

        {/* Footer Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rules */}
          <div className="chess-panel">
            <h3 className="chess-panel-header">📖 Kurallar</h3>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Taş seç → Mümkün hamleleri gör</li>
              <li>• Hedef karesini tıkla ve oyna</li>
              <li>• Geri Al ile hamleleri iptal et</li>
              <li>• Baştan Başla ile oyunu resetle</li>
            </ul>
          </div>

          {/* Tips */}
          <div className="chess-panel">
            <h3 className="chess-panel-header">💡 İpuçları</h3>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Sarı kareleri takip et (son hamle)</li>
              <li>• Yeşil halka taş kapışını gösterir</li>
              <li>• Kırmızı sınır şah durumunu gösterir</li>
              <li>• Kolay ve basit arayüz</li>
            </ul>
          </div>

          {/* Status */}
          <div className="chess-panel">
            <h3 className="chess-panel-header">⚡ Durum</h3>
            <div className="text-sm space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Sırada:</span> {gameState.turn === 'w' ? '♔ Beyaz' : '♚ Siyah'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Hamle:</span> {gameState.history.length}
              </p>
              <p className={`font-semibold ${
                gameState.gameStatus === 'checkmate' ? 'text-red-600 dark:text-red-400' :
                gameState.gameStatus === 'check' ? 'text-orange-600 dark:text-orange-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {gameState.gameStatus === 'checkmate' ? '✓ Şah Mat' :
                 gameState.gameStatus === 'stalemate' ? '= Pat' :
                 gameState.gameStatus === 'check' ? '⚠ Şah' :
                 '✓ Oyun Sürüyor'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
