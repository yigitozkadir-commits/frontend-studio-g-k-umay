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
      if (gameState.promotionFrom && gameState.promotionSquare) {
        const result = makeMove({
          from: gameState.promotionFrom,
          to: gameState.promotionSquare,
          promotion: piece,
        })
        if (result.success) {
          clearSelection()
        }
      }
    },
    [gameState.promotionFrom, gameState.promotionSquare, makeMove, clearSelection]
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

        {/* Main Grid Layout - Responsive Desktop/Tablet/Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-max lg:auto-rows-auto">
          {/* Chess Board - Left/Top (lg:col-span-2) */}
          <div className="lg:col-span-2 animate-slide-from-left">
            <div className="chess-panel flex flex-col items-center gap-4 shadow-panel dark:shadow-panel-dark">
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
          <div className="space-y-6 animate-slide-from-right">
            {/* Game Controls */}
            <div className="chess-panel shadow-panel dark:shadow-panel-dark">
              <GameControls
                turn={gameState.turn}
                gameStatus={gameState.gameStatus}
                moveCount={gameState.history.length}
                capturedPieces={gameState.capturedPieces}
                onReset={resetGame}
                onUndo={undoMove}
              />
            </div>

            {/* Move History */}
            <div className="chess-panel shadow-panel dark:shadow-panel-dark">
              <MoveHistory
                history={gameState.history}
                currentMoveIndex={gameState.history.length - 1}
              />
            </div>
          </div>
        </div>

        {/* Promotion Dialog - Modal */}
        {gameState.showPromotionDialog && (
          <PromotionDialog
            isOpen={gameState.showPromotionDialog}
            color={gameState.turn === 'w' ? 'w' : 'b'}
            onPromote={handlePromotion}
            onCancel={closePromotionDialog}
          />
        )}

        {/* Footer Info - Responsive Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Rules Card */}
          <div className="chess-panel shadow-panel dark:shadow-panel-dark hover:shadow-lg dark:hover:shadow-panel-dark transition-shadow">
            <h3 className="chess-panel-header">📖 Kurallar</h3>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-chess-highlight-valid">•</span>
                <span>Taş seç → Mümkün hamleleri gör</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-chess-highlight-valid">•</span>
                <span>Hedef karesini tıkla ve oyna</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-chess-highlight-valid">•</span>
                <span>Geri Al ile hamleleri iptal et</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-chess-highlight-valid">•</span>
                <span>Baştan Başla ile oyunu resetle</span>
              </li>
            </ul>
          </div>

          {/* Tips Card */}
          <div className="chess-panel shadow-panel dark:shadow-panel-dark hover:shadow-lg dark:hover:shadow-panel-dark transition-shadow">
            <h3 className="chess-panel-header">💡 İpuçları</h3>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="inline-block w-3 h-3 bg-yellow-400 dark:bg-yellow-600 rounded-full mt-1 flex-shrink-0"></span>
                <span>Sarı kareleri takip et (son hamle)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-3 h-3 border-2 border-green-500 rounded-full mt-1 flex-shrink-0"></span>
                <span>Yeşil halka taş kapışını gösterir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></span>
                <span>Kırmızı sınır şah durumunu gösterir</span>
              </li>
              <li className="flex items-start gap-2">
                <span>⚡</span>
                <span>Kolay ve sezgisel arayüz</span>
              </li>
            </ul>
          </div>

          {/* Status Card */}
          <div className="chess-panel shadow-panel dark:shadow-panel-dark hover:shadow-lg dark:hover:shadow-panel-dark transition-shadow">
            <h3 className="chess-panel-header">⚡ Durum</h3>
            <div className="text-sm space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-2 rounded border border-blue-200 dark:border-blue-700">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-blue-700 dark:text-blue-400">Sırada:</span>
                </p>
                <p className="text-base font-bold text-blue-900 dark:text-blue-100">
                  {gameState.turn === 'w' ? '♔ Beyaz' : '♚ Siyah'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-2 rounded border border-purple-200 dark:border-purple-700">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-purple-700 dark:text-purple-400">Hamle:</span>
                </p>
                <p className="text-base font-bold text-purple-900 dark:text-purple-100">
                  {gameState.history.length}
                </p>
              </div>

              <div className={`p-2 rounded border-l-4 ${
                gameState.gameStatus === 'checkmate'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300' :
                gameState.gameStatus === 'check'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-300' :
                gameState.gameStatus === 'stalemate'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-300'
                  : 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300'
              }`}>
                <p className="font-semibold">
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
    </div>
  )
}
