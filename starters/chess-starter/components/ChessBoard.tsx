'use client'

import React, { useState } from 'react'
import { Chess } from 'chess.js'
import { isLightSquare, getPieceSymbol } from '@/lib/gameUtils'
import clsx from 'clsx'

interface ChessBoardProps {
  fen: string
  selectedSquare: string | null
  possibleMoves: string[]
  onSelectSquare: (square: string) => void
  onMakeMove: (move: { from: string; to: string }) => void
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']

export const ChessBoard: React.FC<ChessBoardProps> = ({
  fen,
  selectedSquare,
  possibleMoves,
  onSelectSquare,
  onMakeMove,
}) => {
  const game = new Chess(fen)
  const board = game.board({ asNumbers: false })

  const handleSquareClick = (file: number, rank: number) => {
    const square = `${FILES[file]}${RANKS[rank]}`
    
    if (possibleMoves.includes(square)) {
      onMakeMove({
        from: selectedSquare!,
        to: square,
      })
    } else {
      onSelectSquare(square)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-80 h-80 md:w-96 md:h-96 grid grid-cols-8 gap-0 border-4 border-gray-900 shadow-2xl">
        {RANKS.map((rank, rankIdx) =>
          FILES.map((file, fileIdx) => {
            const square = `${file}${rank}`
            const piece = board[rankIdx]?.[fileIdx]
            const isLight = isLightSquare(square)
            const isSelected = selectedSquare === square
            const isPossibleMove = possibleMoves.includes(square)

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(fileIdx, rankIdx)}
                className={clsx(
                  'chess-square flex items-center justify-center cursor-pointer transition-all',
                  isLight ? 'bg-chess-light' : 'bg-chess-dark',
                  isSelected && 'ring-4 ring-selected ring-inset',
                  isPossibleMove && 'ring-4 ring-highlight ring-inset',
                  'hover:opacity-80'
                )}
              >
                {piece && (
                  <span className="chess-piece text-5xl select-none">
                    {getPieceSymbol(piece.type)}
                  </span>
                )}
                {isPossibleMove && !piece && (
                  <div className="w-3 h-3 bg-highlight rounded-full opacity-70" />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
