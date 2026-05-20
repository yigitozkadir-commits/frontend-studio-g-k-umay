/**
 * Satranç oyunu için utility fonksiyonları
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
  'k': 'Kral',
  'q': 'Vezir',
  'r': 'Kale',
  'b': 'Fil',
  'n': 'At',
  'p': 'Piyon',
}

/**
 * Taşların standart değerleri (material count)
 * K=0: Kral değersizdir (sayısal değerlendirme için)
 * Q=9: En değerli taş
 * R=5: Kale değerli taş
 * B=3, N=3: Fil ve At eşit değerde
 * P=1: Piyon temel birim
 */
export const PIECE_VALUES: Record<string, number> = {
  'P': 1,
  'N': 3,
  'B': 3,
  'R': 5,
  'Q': 9,
  'K': 0, // Kral sayısal değeri yoktur
  'p': 1,
  'n': 3,
  'b': 3,
  'r': 5,
  'q': 9,
  'k': 0,
}

export const getPieceSymbol = (piece: string): string => {
  return PIECE_SYMBOLS[piece] || ''
}

export const getPieceName = (piece: string): string => {
  return PIECE_NAMES[piece.toUpperCase()] || ''
}

export const isLightSquare = (square: string): boolean => {
  const file = square.charCodeAt(0) - 97 // a-h (0-7)
  const rank = parseInt(square[1]) - 1 // 1-8 (0-7)
  // Light squares are where (file + rank) is odd
  return (file + rank) % 2 === 1
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

/**
 * Hamleyi biçimlendirmiş şekilde göster
 */
export const formatMove = (move: { from: string; to: string; san?: string }): string => {
  return move.san || `${move.from}→${move.to}`
}

/**
 * Taş adını Türkçe olarak döndür
 */
export const getPieceNameTurkish = (piece: string): string => {
  const names: Record<string, string> = {
    'P': 'Piyon',
    'p': 'Piyon',
    'N': 'At',
    'n': 'At',
    'B': 'Fil',
    'b': 'Fil',
    'R': 'Kale',
    'r': 'Kale',
    'Q': 'Vezir',
    'q': 'Vezir',
    'K': 'Kral',
    'k': 'Kral',
  }
  return names[piece] || piece
}

/**
 * Turnuva kurallarına göre oyun bitişini kontrol et
 * 50-hamle kuralı (halfmove clock) veya 3-katlı tekrar
 */
export const isTournamentDraw = (
  halfmoveClock: number,
  _moveHistory?: string[]
): boolean => {
  // 50-hamle kuralı: 50 hamle boyunca taş alınmadı veya piyon hareket etmedi
  if (halfmoveClock >= 100) {
    return true
  }

  // 3-katlı tekrar kontrol (basit)
  // Not: Full 3-katlı tekrar deteksiyon chess.js'in isDraw() metodu tarafından yapılır
  return false
}

/**
 * Gambit olup olmadığını kontrol et
 * (İlk 4 hamle içinde şut verme)
 */
export const isGambit = (moveHistory: string[]): boolean => {
  if (moveHistory.length < 3) return false

  // Beyazın 2. veya 4. hamlesinde taş verilmiş mi?
  const whiteMoves = moveHistory.filter((_, i) => i % 2 === 0)
  if (whiteMoves.length >= 2) {
    // Beyazın 2. hamlesinde "x" (capture) varsa Gambit değil
    // Basit heuristic - full analiz için chess.js kullan
    return moveHistory.length <= 4
  }
  return false
}

/**
 * Beyaz ve Siyah taşların material (malzeme) farkını hesapla
 * Pozitif değer: Beyaz önde
 * Negatif değer: Siyah önde
 */
export const getMaterialDifference = (
  capturedByWhite: Array<{ piece: string }> | string[],
  capturedByBlack: Array<{ piece: string }> | string[]
): number => {
  const getWhiteValue = (pieces: Array<{ piece: string }> | string[]): number => {
    if (Array.isArray(pieces) && pieces.length === 0) return 0
    if (Array.isArray(pieces) && typeof pieces[0] === 'string') {
      return (pieces as string[]).reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0)
    }
    return (pieces as Array<{ piece: string }>).reduce(
      (sum, p) => sum + (PIECE_VALUES[p.piece] || 0),
      0
    )
  }

  const whiteValue = getWhiteValue(capturedByWhite)
  const blackValue = getWhiteValue(capturedByBlack)
  return whiteValue - blackValue
}

/**
 * Oyun pozisyonunu değerlendir (basit değerlendirme)
 * Material + Position Score döndürür
 */
export const getPositionEvaluation = (fen: string): {
  material: number
  position: number
  total: number
} => {
  // Parse FEN to get piece positions
  const fenBoard = fen.split(' ')[0]
  const rows = fenBoard.split('/')

  let material = 0
  let positionScore = 0

  // Piece-square tables for basic position evaluation
  const pawnTable = [
    0, 0, 0, 0, 0, 0, 0, 0,
    5, 10, 10, -20, -20, 10, 10, 5,
    5, -5, -10, 0, 0, -10, -5, 5,
    0, 0, 0, 20, 20, 0, 0, 0,
    5, 5, 10, 25, 25, 10, 5, 5,
    10, 10, 20, 30, 30, 20, 10, 10,
    50, 50, 50, 50, 50, 50, 50, 50,
    0, 0, 0, 0, 0, 0, 0, 0,
  ]

  const knightTable = [
    -50, -40, -30, -30, -30, -30, -40, -50,
    -40, -20, 0, 5, 5, 0, -20, -40,
    -30, 5, 10, 15, 15, 10, 5, -30,
    -30, 0, 15, 20, 20, 15, 0, -30,
    -30, 5, 15, 20, 20, 15, 5, -30,
    -30, 0, 10, 15, 15, 10, 0, -30,
    -40, -20, 0, 0, 0, 0, -20, -40,
    -50, -40, -30, -30, -30, -30, -40, -50,
  ]

  const kingTable = [
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -20, -30, -30, -40, -40, -30, -30, -20,
    -10, -20, -20, -20, -20, -20, -20, -10,
    20, 30, 10, 0, 0, 10, 30, 20,
    20, 30, 10, 0, 0, 10, 30, 20,
  ]

  rows.forEach((row, rankIndex) => {
    let fileIndex = 0
    for (const char of row) {
      if (char === '/') break
      if (/\d/.test(char)) {
        fileIndex += parseInt(char)
      } else {
        const isWhite = /[A-Z]/.test(char)
        const value = PIECE_VALUES[char] || 0
        const sign = isWhite ? 1 : -1

        material += sign * value

        // Position score based on piece-square tables
        const squareIndex = rankIndex * 8 + fileIndex
        if (char.toLowerCase() === 'p') {
          positionScore += sign * pawnTable[squareIndex]
        } else if (char.toLowerCase() === 'n') {
          positionScore += sign * knightTable[squareIndex]
        } else if (char.toLowerCase() === 'k') {
          positionScore += sign * kingTable[squareIndex]
        }

        fileIndex++
      }
    }
  })

  return {
    material,
    position: positionScore,
    total: material + positionScore,
  }
}

/**
 * FEN string'i okunabilir formata dönüştür
 */
export const formatFen = (fen: string): string => {
  const parts = fen.split(' ')
  if (parts.length !== 6) return fen

  const [board, turn, castling, enPassant, halfmove, fullmove] = parts

  const turnText = turn === 'w' ? 'Beyaz' : 'Siyah'
  const castlingText =
    castling === '-'
      ? 'Yok'
      : `${castling.includes('K') ? 'Beyaz K ' : ''}${castling.includes('Q') ? 'Beyaz Q ' : ''}${castling.includes('k') ? 'Siyah K ' : ''}${castling.includes('q') ? 'Siyah Q' : ''}`.trim()
  const enPassantText = enPassant === '-' ? 'Yok' : enPassant

  return `Tahtası: ${board}\nSıra: ${turnText}\nRokad: ${castlingText}\nEn Passant: ${enPassantText}\nYarım Hamle: ${halfmove}\nTam Hamle: ${fullmove}`
}

/**
 * Sayısal koordinatları satranç notasyonuna çevir
 * @param file 0-7 arası dosya (a-h)
 * @param rank 0-7 arası sıra (1-8)
 * @returns a1-h8 arası notasyon
 */
export const getSquareNotationFromCoordinates = (file: number, rank: number): string => {
  if (file < 0 || file > 7 || rank < 0 || rank > 7) {
    return ''
  }
  return String.fromCharCode(97 + file) + (rank + 1)
}

/**
 * Square notasyonundan sayısal koordinatlara dönüştür
 */
export const getCoordinatesFromSquareNotation = (square: string): { file: number; rank: number } | null => {
  if (!square || square.length !== 2) return null
  const file = square.charCodeAt(0) - 97 // a-h = 0-7
  const rank = parseInt(square[1]) - 1 // 1-8 = 0-7
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null
  return { file, rank }
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
