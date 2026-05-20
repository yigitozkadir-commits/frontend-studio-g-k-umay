/**
 * Satranç tahtası için yardımcı fonksiyonlar
 */

export const PIECE_SYMBOLS: Record<string, string> = {
  'K': '♔', // White King
  'Q': '♕', // White Queen
  'R': '♖', // White Rook
  'B': '♗', // White Bishop
  'N': '♘', // White Knight
  'P': '♙', // White Pawn
  'k': '♚', // Black King
  'q': '♛', // Black Queen
  'r': '♜', // Black Rook
  'b': '♝', // Black Bishop
  'n': '♞', // Black Knight
  'p': '♟', // Black Pawn
}

export const PIECE_NAMES: Record<string, string> = {
  'K': 'Kral',
  'Q': 'Vezir',
  'R': 'Kale',
  'B': 'Fil',
  'N': 'At',
  'P': 'Piyon',
}

export const getPieceSymbol = (piece: string): string => {
  return PIECE_SYMBOLS[piece] || ''
}

export const getPieceName = (piece: string): string => {
  return PIECE_NAMES[piece.toUpperCase()] || ''
}

export const isLightSquare = (square: string): boolean => {
  const file = square.charCodeAt(0) - 97 // a-h
  const rank = parseInt(square[1]) - 1 // 1-8
  return (file + rank) % 2 === 0
}

export const squareToCoordinates = (square: string): { file: number; rank: number } => {
  return {
    file: square.charCodeAt(0) - 97,
    rank: parseInt(square[1]) - 1,
  }
}

export const coordinatesToSquare = (file: number, rank: number): string => {
  return String.fromCharCode(97 + file) + (rank + 1)
}

export const formatMove = (move: { from: string; to: string; san?: string }): string => {
  return move.san || `${move.from}→${move.to}`
}

export const getGameStatusMessage = (status: string, turn: 'w' | 'b'): string => {
  const player = turn === 'w' ? 'Beyaz' : 'Siyah'
  
  switch (status) {
    case 'checkmate':
      return `${player === 'Beyaz' ? 'Siyah' : 'Beyaz'} kazandı! (Şah Matt)`
    case 'stalemate':
      return 'Oyun berabere! (Pat Durumu)'
    case 'check':
      return `${player} Şah durumunda!`
    default:
      return `${player} oyuncu sırada`
  }
}
