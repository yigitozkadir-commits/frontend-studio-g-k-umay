'use client'

import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

interface Move {
  from: string
  to: string
  san: string
  piece: string
}

interface MoveHistoryProps {
  history: Move[]
  currentMoveIndex?: number
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history, currentMoveIndex }) => {
  const [copied, setCopied] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastMoveRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest move
  useEffect(() => {
    if (lastMoveRef.current && scrollContainerRef.current) {
      lastMoveRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [history.length])

  const copyToClipboard = async () => {
    const pgn = history.map((m) => m.san).join(' ')
    try {
      await navigator.clipboard.writeText(pgn)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Group moves into pairs (white, black)
  const moveGroups = []
  for (let i = 0; i < history.length; i += 2) {
    moveGroups.push({
      number: Math.floor(i / 2) + 1,
      white: history[i],
      whiteIndex: i,
      black: history[i + 1],
      blackIndex: i + 1,
    })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col h-full border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <span>📋</span> Hamle Geçmişi
        </h3>
        <span className="text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full">
          {history.length} hamle
        </span>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Henüz hamle yapılmadı - oyuna başlamak için taş seçin
          </p>
        </div>
      ) : (
        <>
          {/* Move List */}
          <div
            ref={scrollContainerRef}
            className="flex-1 space-y-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            role="region"
            aria-label="Move history"
          >
            {moveGroups.map((group) => (
              <div
                key={group.number}
                className="grid grid-cols-3 gap-2 text-sm items-start"
              >
                {/* Move Number */}
                <div className="font-mono font-bold text-gray-500 dark:text-gray-500 pt-2 text-center select-none">
                  {group.number}.
                </div>

                {/* White Move */}
                <div
                  ref={group.whiteIndex === history.length - 1 ? lastMoveRef : null}
                  className={clsx(
                    'p-2.5 rounded-lg transition-all duration-200 cursor-pointer',
                    'border-2 border-transparent',
                    currentMoveIndex === group.whiteIndex
                      ? 'bg-blue-500 text-white font-bold border-blue-600 shadow-md ring-2 ring-blue-400'
                      : 'bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 border-gray-200 dark:border-slate-600'
                  )}
                  role="button"
                  aria-pressed={currentMoveIndex === group.whiteIndex}
                  title={`${group.white.san}: ${group.white.from} to ${group.white.to}`}
                >
                  <span className="font-bold text-base">{group.white.san}</span>
                  <span className={clsx('text-xs block mt-0.5 font-mono', currentMoveIndex === group.whiteIndex ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400')}>
                    {group.white.from}→{group.white.to}
                  </span>
                </div>

                {/* Black Move */}
                {group.black && (
                  <div
                    ref={group.blackIndex === history.length - 1 ? lastMoveRef : null}
                    className={clsx(
                      'p-2.5 rounded-lg transition-all duration-200 cursor-pointer',
                      'border-2 border-transparent',
                      currentMoveIndex === group.blackIndex
                        ? 'bg-blue-500 text-white font-bold border-blue-600 shadow-md ring-2 ring-blue-400'
                        : 'bg-gray-100 dark:bg-slate-600 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-500 border-gray-300 dark:border-slate-500'
                    )}
                    role="button"
                    aria-pressed={currentMoveIndex === group.blackIndex}
                    title={`${group.black.san}: ${group.black.from} to ${group.black.to}`}
                  >
                    <span className="font-bold text-base">{group.black.san}</span>
                    <span className={clsx('text-xs block mt-0.5 font-mono', currentMoveIndex === group.blackIndex ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400')}>
                      {group.black.from}→{group.black.to}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PGN Copy Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <span>📄</span> PGN Notasyonu
            </p>
            <div className="flex gap-2">
              <div className="flex-1 text-left p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-mono text-gray-700 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap hover:text-ellipsis focus:ring-2 focus:ring-blue-400">
                {history.map((m) => m.san).join(' ')}
              </div>
              <button
                onClick={copyToClipboard}
                className={clsx(
                  'px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'flex items-center gap-1',
                  copied
                    ? 'bg-green-500 text-white focus:ring-green-400'
                    : 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95 focus:ring-blue-400'
                )}
                aria-label="Copy PGN to clipboard"
                type="button"
                title="Hamleleri kopyala"
              >
                {copied ? (
                  <>
                    <span>✓</span>
                    <span>Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {history.length} hamle • {Math.ceil(history.length / 2)} tur
            </p>
          </div>
        </>
      )}
    </div>
  )
}
