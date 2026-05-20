'use client'

import React from 'react'
import { getGameStatusMessage } from '@/lib/gameUtils'

interface GameControlsProps {
  turn: 'w' | 'b'
  gameStatus: 'playing' | 'checkmate' | 'stalemate' | 'check'
  moveCount: number
  onReset: () => void
  onUndo: () => void
}

export const GameControls: React.FC<GameControlsProps> = ({
  turn,
  gameStatus,
  moveCount,
  onReset,
  onUndo,
}) => {
  const statusMessage = getGameStatusMessage(gameStatus, turn)
  const isGameOver = gameStatus === 'checkmate' || gameStatus === 'stalemate'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 space-y-6">
      {/* Game Status */}
      <div className="border-l-4 border-blue-500 pl-4">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
          Oyun Durumu
        </p>
        <p className={`text-lg font-bold ${
          isGameOver ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
        }`}>
          {statusMessage}
        </p>
      </div>

      {/* Move Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Yapılan Hamle
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {moveCount}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Sırada Olan
          </p>
          <p className="text-lg font-bold">
            {turn === 'w' ? '♔ Beyaz' : '♚ Siyah'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={onUndo}
          disabled={moveCount === 0}
          className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded transition-colors"
        >
          ← Geri Al
        </button>
        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition-colors"
        >
          🔄 Baştan Başla
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>💡 İpucu:</strong> Taş seç → Mümkün hamleleri gör → Hedef karesini tıkla
        </p>
      </div>
    </div>
  )
}
