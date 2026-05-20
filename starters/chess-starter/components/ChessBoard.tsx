'use client'

import React, { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { isLightSquare, getPieceSymbol } from '@/lib/gameUtils'
import clsx from 'clsx'

interface ChessBoardProps {
  fen: string
  selectedSquare: string | null
  possibleMoves: string[]
  lastMove?: { from: string; to: string }
  isInCheck: boolean
  onSelectSquare: (square: string) => void
  onMakeMove: (move: { from: string; to: string }) => void
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']

export const ChessBoard: React.FC<ChessBoardProps> = ({
  fen,
  selectedSquare,
  possibleMoves,
  lastMove,
  isInCheck,
  onSelectSquare,
  onMakeMove,
}) => {
  const [selectedForKeyboard, setSelectedForKeyboard] = useState<string | null>(null)
  const game = new Chess(fen)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const board = (game.board as any)() as Array<Array<any>>

  // Find king position for check indication
  const kingSquare = React.useMemo(() => {
    const currentTurn = game.turn()
    const king = currentTurn === 'w' ? 'K' : 'k'
    for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
      for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
        const piece = board[rankIdx]?.[fileIdx]
        if (piece?.type === king.toLowerCase()) {
          return `${FILES[fileIdx]}${RANKS[rankIdx]}`
        }
      }
    }
    return null
  }, [board])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedForKeyboard) return

      const coords = selectedForKeyboard.split('')
      let newFile = FILES.indexOf(coords[0])
      let newRank = RANKS.indexOf(coords[1])

      let moved = false
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (newRank > 0) {
            newRank--
            moved = true
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (newRank < 7) {
            newRank++
            moved = true
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (newFile > 0) {
            newFile--
            moved = true
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (newFile < 7) {
            newFile++
            moved = true
          }
          break
        case 'Enter':
          e.preventDefault()
          handleSquareClick(newFile, newRank)
          return
        case 'Escape':
          e.preventDefault()
          setSelectedForKeyboard(null)
          return
      }

      if (moved) {
        const newSquare = `${FILES[newFile]}${RANKS[newRank]}`
        setSelectedForKeyboard(newSquare)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedForKeyboard])

  const handleSquareClick = (file: number, rank: number) => {
    const square = `${FILES[file]}${RANKS[rank]}`

    if (possibleMoves.includes(square)) {
      onMakeMove({
        from: selectedSquare!,
        to: square,
      })
      setSelectedForKeyboard(null)
    } else {
      onSelectSquare(square)
      setSelectedForKeyboard(square)
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Board Container */}
      <div className="relative inline-block">
        {/* Rank Numbers (Left) */}
        <div className="absolute -left-8 top-0 h-full flex flex-col justify-between py-2 w-6">
          {RANKS.map((rank) => (
            <div
              key={rank}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 h-10 flex items-center justify-center"
              aria-hidden="true"
            >
              {rank}
            </div>
          ))}
        </div>

        {/* File Letters (Bottom) */}
        <div className="absolute -bottom-7 left-0 right-0 h-6 flex justify-between px-2">
          {FILES.map((file) => (
            <div
              key={file}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 w-10 flex items-center justify-center"
              aria-hidden="true"
            >
              {file}
            </div>
          ))}
        </div>

        {/* Chess Board Grid */}
        <div
          className={clsx(
            'grid grid-cols-8 gap-0',
            'border-4 border-gray-900 dark:border-gray-700',
            'shadow-2xl rounded-sm',
            'w-80 h-80 md:w-96 md:h-96',
            'focus-within:ring-2 focus-within:ring-blue-500'
          )}
          role="application"
          aria-label="Interactive chess board"
        >
          {RANKS.map((rank, rankIdx) =>
            FILES.map((file, fileIdx) => {
              const square = `${file}${rank}`
              const piece = board[rankIdx]?.[fileIdx]
              const isLight = isLightSquare(square)
              const isSelected = selectedSquare === square || selectedForKeyboard === square
              const isPossibleMove = possibleMoves.includes(square)
              const isLastMoveFrom = lastMove?.from === square
              const isLastMoveTo = lastMove?.to === square
              const isKingInCheck = isInCheck && kingSquare === square

              return (
                <button
                  key={square}
                  onClick={() => handleSquareClick(fileIdx, rankIdx)}
                  className={clsx(
                    'chess-square flex items-center justify-center cursor-pointer transition-all duration-150 relative',
                    'text-5xl select-none',
                    // Base square colors
                    isLight ? 'bg-chess-light' : 'bg-chess-dark',
                    // Last move highlighting with smooth transitions
                    isLastMoveFrom && 'bg-opacity-100 bg-yellow-400 dark:bg-yellow-600',
                    isLastMoveTo && 'bg-opacity-100 bg-yellow-300 dark:bg-yellow-500',
                    // Selected square
                    isSelected && 'ring-4 ring-blue-500 ring-inset shadow-inner z-10',
                    // Check indicator
                    isKingInCheck && 'animate-pulse bg-red-400 dark:bg-red-600 ring-2 ring-red-600 dark:ring-red-400',
                    // Possible moves
                    isPossibleMove && !isSelected && 'ring-4 ring-green-400 ring-inset',
                    // Hover and focus states
                    'hover:brightness-90 dark:hover:brightness-110',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    'dark:focus:ring-offset-slate-900'
                  )}
                  aria-label={`Square ${square}${piece ? `, contains ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}${isSelected ? ', selected' : ''}${isPossibleMove ? ', possible move' : ''}`}
                  type="button"
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSquareClick(fileIdx, rankIdx)
                    }
                  }}
                >
                  {/* Check Indicator Border */}
                  {isKingInCheck && (
                    <div className="absolute inset-0.5 border-3 border-red-600 dark:border-red-400 rounded-xs pointer-events-none animate-pulse" />
                  )}

                  {/* Piece Symbol with Drop Shadow */}
                  {piece && (
                    <span
                      className="chess-piece drop-shadow-lg transition-transform duration-200"
                      aria-hidden="true"
                    >
                      {getPieceSymbol(piece.type)}
                    </span>
                  )}

                  {/* Possible Move Empty Square Indicator */}
                  {isPossibleMove && !piece && (
                    <div className="w-3 h-3 bg-green-500 rounded-full opacity-80 shadow-md animate-pulse" />
                  )}

                  {/* Possible Move Capture Indicator */}
                  {isPossibleMove && piece && (
                    <div className="absolute inset-1 border-3 border-green-500 rounded-xs opacity-80 animate-pulse" />
                  )}

                  {/* Last Move Glow Effect */}
                  {(isLastMoveFrom || isLastMoveTo) && (
                    <div className="absolute inset-0 rounded-xs opacity-20 pointer-events-none animate-pulse" />
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Keyboard Controls Info */}
      <div className="text-center space-y-1">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          ⌨️ Klavye Kontrolleri
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          ↑↓←→ kareleri seç • Enter hamle yap • Esc iptal et
        </p>
      </div>

      {/* Board Legend */}
      <div className="text-center space-y-1 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex gap-4 justify-center flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 dark:bg-yellow-600 rounded"></div>
            <span>Son Hamle</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
            <span>Seçili</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-green-500 rounded"></div>
            <span>Mümkün</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 dark:bg-red-600 rounded"></div>
            <span>Şah</span>
          </div>
        </div>
      </div>
    </div>
  )
}
