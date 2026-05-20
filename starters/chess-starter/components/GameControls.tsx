'use client'

import React, { useMemo } from 'react'
import { getGameStatusMessage, getPieceSymbol, PIECE_VALUES } from '@/lib/gameUtils'
import clsx from 'clsx'

interface GameControlsProps {
  turn: 'w' | 'b'
  gameStatus: 'playing' | 'checkmate' | 'stalemate' | 'check' | 'draw'
  moveCount: number
  capturedPieces: Array<{ piece: string; color: 'w' | 'b'; moveNumber?: number; turn?: number }>
  onReset: () => void
  onUndo: () => void
}

export const GameControls: React.FC<GameControlsProps> = ({
  turn,
  gameStatus,
  moveCount,
  capturedPieces,
  onReset,
  onUndo,
}) => {
  const statusMessage = getGameStatusMessage(gameStatus, turn)
  const isGameOver = gameStatus === 'checkmate' || gameStatus === 'stalemate'

  // Calculate material count
  const materialCount = useMemo(() => {
    let white = 0
    let black = 0
    capturedPieces.forEach((piece) => {
      const value = PIECE_VALUES[piece.piece] || 0
      if (piece.color === 'w') {
        black += value
      } else {
        white += value
      }
    })
    return { white, black }
  }, [capturedPieces])

  // Group captured pieces by color
  const whiteCaptured = useMemo(
    () => capturedPieces.filter((p) => p.color === 'w'),
    [capturedPieces]
  )
  const blackCaptured = useMemo(
    () => capturedPieces.filter((p) => p.color === 'b'),
    [capturedPieces]
  )

  const statusColor = isGameOver
    ? 'text-red-600 dark:text-red-400'
    : gameStatus === 'check'
      ? 'text-orange-600 dark:text-orange-400'
      : 'text-green-600 dark:text-green-400'

  const statusIcon = isGameOver
    ? '🏁'
    : gameStatus === 'check'
      ? '⚠️'
      : '✓'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
      {/* Game Status */}
      <div className={clsx(
        'border-l-4 pl-4 py-3 rounded-r-lg transition-all',
        gameStatus === 'check' && 'border-orange-500 bg-orange-50 dark:bg-orange-900/30',
        isGameOver && 'border-red-500 bg-red-50 dark:bg-red-900/30',
        gameStatus === 'playing' && 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
      )}>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
          <span>{statusIcon}</span>
          <span>Oyun Durumu</span>
        </p>
        <p className={`text-lg font-bold ${statusColor}`}>
          {statusMessage}
        </p>
      </div>

      {/* Move Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1">
            <span>📊</span>
            <span>Hamle Sayısı</span>
          </p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {moveCount}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-1">
            <span>👤</span>
            <span>Sırada Olan</span>
          </p>
          <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
            {turn === 'w' ? '♔ Beyaz' : '♚ Siyah'}
          </p>
        </div>
      </div>

      {/* Captured Pieces */}
      {(whiteCaptured.length > 0 || blackCaptured.length > 0) && (
        <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1">
            <span>🎯</span>
            <span>Sürülen Taşlar</span>
          </h4>

          {/* White Captured (pieces taken by white) */}
          {blackCaptured.length > 0 && (
            <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-lg border border-blue-200 dark:border-slate-600">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1 justify-between">
                <span className="flex items-center gap-1">
                  <span>♔</span>
                  <span>Beyaz Kazandı</span>
                </span>
                {materialCount.white > 0 && (
                  <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    +{materialCount.white}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {blackCaptured.map((piece, idx) => (
                  <div
                    key={idx}
                    className="text-lg bg-white dark:bg-slate-600 rounded px-2 py-1 shadow-sm border border-blue-300 dark:border-slate-500 hover:shadow-md transition-shadow"
                    aria-label={`Captured piece: ${piece.piece}`}
                    title={`${piece.piece}`}
                  >
                    {getPieceSymbol(piece.piece)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Black Captured (pieces taken by black) */}
          {whiteCaptured.length > 0 && (
            <div className="bg-gray-100 dark:bg-slate-600 p-3 rounded-lg border border-gray-300 dark:border-slate-500">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1 justify-between">
                <span className="flex items-center gap-1">
                  <span>♚</span>
                  <span>Siyah Kazandı</span>
                </span>
                {materialCount.black > 0 && (
                  <span className="bg-gray-700 dark:bg-gray-800 text-white px-2 py-0.5 rounded text-xs font-bold">
                    +{materialCount.black}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {whiteCaptured.map((piece, idx) => (
                  <div
                    key={idx}
                    className="text-lg bg-gray-50 dark:bg-slate-500 rounded px-2 py-1 shadow-sm border border-gray-400 dark:border-slate-400 hover:shadow-md transition-shadow"
                    aria-label={`Captured piece: ${piece.piece}`}
                    title={`${piece.piece}`}
                  >
                    {getPieceSymbol(piece.piece)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={onUndo}
          disabled={moveCount === 0}
          className={clsx(
            'flex-1 px-4 py-3 font-semibold rounded-lg transition-all duration-200',
            'flex items-center justify-center gap-2',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            moveCount === 0
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white shadow-md hover:shadow-lg focus:ring-yellow-400'
          )}
          aria-label="Undo last move"
          type="button"
          title="Ctrl+Z"
        >
          <span>↶</span>
          <span>Geri Al</span>
        </button>
        <button
          onClick={onReset}
          className={clsx(
            'flex-1 px-4 py-3 font-semibold rounded-lg',
            'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
            'active:scale-95 text-white transition-all duration-200 shadow-md hover:shadow-lg',
            'flex items-center justify-center gap-2',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400',
            'dark:focus:ring-offset-slate-800'
          )}
          aria-label="Reset game"
          type="button"
          title="Oyunu baştan başlat"
        >
          <span>🔄</span>
          <span>Baştan</span>
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
          <strong>💡 İpucu:</strong> Taş seçin, mümkün hamleleri görün, hedef karesine tıklayın
        </p>
      </div>
    </div>
  )
}
