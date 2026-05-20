'use client'

import React, { useEffect } from 'react'
import clsx from 'clsx'
import { getPieceSymbol, getPieceName } from '@/lib/gameUtils'

interface PromotionDialogProps {
  isOpen: boolean
  color: 'w' | 'b'
  onPromote: (piece: string) => void
  onCancel: () => void
}

const PROMOTION_PIECES = ['q', 'r', 'b', 'n']
const PROMOTION_PIECES_WHITE = ['Q', 'R', 'B', 'N']

export const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  color,
  onPromote,
  onCancel,
}) => {
  const pieces = color === 'w' ? PROMOTION_PIECES_WHITE : PROMOTION_PIECES

  // Keyboard shortcuts for promotion
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (['Q', 'R', 'B', 'N'].includes(key)) {
        e.preventDefault()
        onPromote(key.toLowerCase())
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onPromote, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promotion-title"
      onClick={onCancel}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Dialog Content */}
      <div
        className={clsx(
          'relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4',
          'border-2 border-gray-200 dark:border-gray-700',
          'animate-pop-in origin-center'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="promotion-title"
          className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white"
        >
          ♟ Piyon Terfi Seçimi ♟
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {color === 'w'
            ? '♙ Beyaz piyonunuz 8. ranka ulaştı! Hangi taşa dönüştürmek istersiniz?'
            : '♟ Siyah piyonunuz 1. ranka ulaştı! Hangi taşa dönüştürmek istersiniz?'}
        </p>

        {/* Promotion Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {pieces.map((piece) => (
            <button
              key={piece}
              onClick={() => onPromote(piece.toLowerCase())}
              className={clsx(
                'py-4 px-4 rounded-xl font-bold text-lg transition-all duration-200',
                'border-2 border-gray-300 dark:border-gray-600',
                'hover:scale-105 hover:shadow-lg active:scale-95',
                'bg-gradient-to-b from-gray-50 to-gray-100',
                'dark:from-slate-800 dark:to-slate-700',
                'text-gray-900 dark:text-white',
                'flex flex-col items-center justify-center gap-2',
                'group hover:border-blue-500 dark:hover:border-blue-400',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                'dark:focus:ring-offset-slate-900'
              )}
              aria-label={`Promote to ${getPieceName(piece)}`}
              type="button"
              title={`${getPieceName(piece)} (${piece.toUpperCase()})`}
            >
              <span className="text-6xl group-hover:scale-110 transition-transform drop-shadow-lg">
                {getPieceSymbol(piece)}
              </span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {getPieceName(piece)}
              </span>
              <span className="text-2xs font-mono text-gray-500 dark:text-gray-500 group-hover:text-blue-500">
                ({piece.toUpperCase()})
              </span>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className={clsx(
            'w-full py-3 px-4 font-semibold rounded-lg transition-all duration-200',
            'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600',
            'text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
            'dark:focus:ring-offset-slate-900'
          )}
          aria-label="Cancel promotion"
          type="button"
        >
          ❌ İptal Et
        </button>

        {/* Keyboard Hint */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200 text-center leading-relaxed">
            <strong>⌨️ Klavye Kısayolu:</strong> Q, R, B, N tuşlarını kullan veya Esc ile iptal et
          </p>
        </div>
      </div>
    </div>
  )
}
