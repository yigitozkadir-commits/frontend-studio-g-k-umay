'use client'

import React from 'react'
import { formatMove } from '@/lib/gameUtils'

interface Move {
  from: string
  to: string
  san: string
  piece: string
}

interface MoveHistoryProps {
  history: Move[]
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>📋</span> Hamle Geçmişi
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Henüz hamle yapılmadı
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {history.map((move, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-700 p-2 rounded text-sm"
              >
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {index + 1}.
                </span>
                <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">
                  {move.san}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-xs ml-1">
                  ({move.from}→{move.to})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            PGN Formatı (Kopyala)
          </p>
          <button
            onClick={() => {
              const pgn = history.map((m) => m.san).join(' ')
              navigator.clipboard.writeText(pgn)
            }}
            className="w-full text-left p-2 bg-white dark:bg-slate-800 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            {history.map((m) => m.san).join(' ')}
          </button>
        </div>
      )}
    </div>
  )
}
