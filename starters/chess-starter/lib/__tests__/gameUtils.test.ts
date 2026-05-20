import {
  PIECE_SYMBOLS,
  PIECE_NAMES,
  PIECE_VALUES,
  getPieceSymbol,
  getPieceName,
  isLightSquare,
  squareToCoordinates,
  coordinatesToSquare,
  formatMove,
  getPieceNameTurkish,
  isTournamentDraw,
  getMaterialDifference,
  getPositionEvaluation,
  formatFen,
  getSquareNotationFromCoordinates,
  getCoordinatesFromSquareNotation,
  getGameStatusMessage,
} from '../gameUtils'

describe('gameUtils', () => {
  describe('PIECE_SYMBOLS', () => {
    it('provides unicode symbols for all pieces', () => {
      expect(PIECE_SYMBOLS['K']).toBe('♔')
      expect(PIECE_SYMBOLS['Q']).toBe('♕')
      expect(PIECE_SYMBOLS['R']).toBe('♖')
      expect(PIECE_SYMBOLS['B']).toBe('♗')
      expect(PIECE_SYMBOLS['N']).toBe('♘')
      expect(PIECE_SYMBOLS['P']).toBe('♙')
      expect(PIECE_SYMBOLS['k']).toBe('♚')
      expect(PIECE_SYMBOLS['q']).toBe('♛')
      expect(PIECE_SYMBOLS['r']).toBe('♜')
      expect(PIECE_SYMBOLS['b']).toBe('♝')
      expect(PIECE_SYMBOLS['n']).toBe('♞')
      expect(PIECE_SYMBOLS['p']).toBe('♟')
    })
  })

  describe('PIECE_NAMES', () => {
    it('provides Turkish names for all pieces', () => {
      expect(PIECE_NAMES['K']).toBe('Kral')
      expect(PIECE_NAMES['Q']).toBe('Vezir')
      expect(PIECE_NAMES['R']).toBe('Kale')
      expect(PIECE_NAMES['B']).toBe('Fil')
      expect(PIECE_NAMES['N']).toBe('At')
      expect(PIECE_NAMES['P']).toBe('Piyon')
    })
  })

  describe('PIECE_VALUES', () => {
    it('assigns correct material values', () => {
      expect(PIECE_VALUES['P']).toBe(1)
      expect(PIECE_VALUES['N']).toBe(3)
      expect(PIECE_VALUES['B']).toBe(3)
      expect(PIECE_VALUES['R']).toBe(5)
      expect(PIECE_VALUES['Q']).toBe(9)
      expect(PIECE_VALUES['K']).toBe(0)
    })

    it('works for both colors', () => {
      expect(PIECE_VALUES['p']).toBe(1)
      expect(PIECE_VALUES['n']).toBe(3)
      expect(PIECE_VALUES['b']).toBe(3)
      expect(PIECE_VALUES['r']).toBe(5)
      expect(PIECE_VALUES['q']).toBe(9)
      expect(PIECE_VALUES['k']).toBe(0)
    })
  })

  describe('getPieceSymbol', () => {
    it('returns correct symbols for white pieces', () => {
      expect(getPieceSymbol('K')).toBe('♔')
      expect(getPieceSymbol('Q')).toBe('♕')
      expect(getPieceSymbol('P')).toBe('♙')
    })

    it('returns correct symbols for black pieces', () => {
      expect(getPieceSymbol('k')).toBe('♚')
      expect(getPieceSymbol('q')).toBe('♛')
      expect(getPieceSymbol('p')).toBe('♟')
    })

    it('returns empty string for invalid piece', () => {
      expect(getPieceSymbol('X')).toBe('')
      expect(getPieceSymbol('')).toBe('')
    })
  })

  describe('getPieceName', () => {
    it('returns Turkish names for white pieces', () => {
      expect(getPieceName('K')).toBe('Kral')
      expect(getPieceName('Q')).toBe('Vezir')
    })

    it('returns Turkish names for black pieces', () => {
      expect(getPieceName('k')).toBe('Kral')
      expect(getPieceName('q')).toBe('Vezir')
    })

    it('handles case insensitivity', () => {
      expect(getPieceName('k')).toBe('Kral')
      expect(getPieceName('K')).toBe('Kral')
    })

    it('returns empty string for invalid piece', () => {
      expect(getPieceName('X')).toBe('')
    })
  })

  describe('isLightSquare', () => {
    it('identifies light squares correctly', () => {
      expect(isLightSquare('a1')).toBe(false) // Dark square
      expect(isLightSquare('a2')).toBe(true) // Light square
      expect(isLightSquare('h1')).toBe(true) // Light square
      expect(isLightSquare('h8')).toBe(false) // Dark square
    })

    it('handles all corner squares', () => {
      expect(isLightSquare('a1')).toBe(false)
      expect(isLightSquare('a8')).toBe(true)
      expect(isLightSquare('h1')).toBe(true)
      expect(isLightSquare('h8')).toBe(false)
    })

    it('works for center squares', () => {
      expect(isLightSquare('d4')).toBe(true)
      expect(isLightSquare('e4')).toBe(false)
      expect(isLightSquare('d5')).toBe(false)
      expect(isLightSquare('e5')).toBe(true)
    })
  })

  describe('squareToCoordinates', () => {
    it('converts standard notation to coordinates', () => {
      const result = squareToCoordinates('a1')
      expect(result.file).toBe(0)
      expect(result.rank).toBe(0)
    })

    it('converts to h8 correctly', () => {
      const result = squareToCoordinates('h8')
      expect(result.file).toBe(7)
      expect(result.rank).toBe(7)
    })

    it('converts e4 correctly', () => {
      const result = squareToCoordinates('e4')
      expect(result.file).toBe(4)
      expect(result.rank).toBe(3)
    })

    it('converts center squares', () => {
      const result = squareToCoordinates('d5')
      expect(result.file).toBe(3)
      expect(result.rank).toBe(4)
    })
  })

  describe('coordinatesToSquare', () => {
    it('converts coordinates to standard notation', () => {
      expect(coordinatesToSquare(0, 0)).toBe('a1')
      expect(coordinatesToSquare(7, 7)).toBe('h8')
    })

    it('converts e4 correctly', () => {
      expect(coordinatesToSquare(4, 3)).toBe('e4')
    })

    it('converts center squares', () => {
      expect(coordinatesToSquare(3, 4)).toBe('d5')
    })

    it('handles all files', () => {
      expect(coordinatesToSquare(0, 0)).toBe('a1')
      expect(coordinatesToSquare(1, 0)).toBe('b1')
      expect(coordinatesToSquare(2, 0)).toBe('c1')
      expect(coordinatesToSquare(3, 0)).toBe('d1')
      expect(coordinatesToSquare(4, 0)).toBe('e1')
      expect(coordinatesToSquare(5, 0)).toBe('f1')
      expect(coordinatesToSquare(6, 0)).toBe('g1')
      expect(coordinatesToSquare(7, 0)).toBe('h1')
    })
  })

  describe('formatMove', () => {
    it('uses SAN notation if available', () => {
      const move = { from: 'e2', to: 'e4', san: 'e4' }
      expect(formatMove(move)).toBe('e4')
    })

    it('falls back to arrow notation without SAN', () => {
      const move = { from: 'e2', to: 'e4' }
      expect(formatMove(move)).toBe('e2→e4')
    })

    it('handles complex SAN', () => {
      const move = { from: 'b5', to: 'c6', san: 'Nxc6+' }
      expect(formatMove(move)).toBe('Nxc6+')
    })
  })

  describe('getPieceNameTurkish', () => {
    it('returns Turkish names for all pieces', () => {
      expect(getPieceNameTurkish('P')).toBe('Piyon')
      expect(getPieceNameTurkish('p')).toBe('Piyon')
      expect(getPieceNameTurkish('N')).toBe('At')
      expect(getPieceNameTurkish('n')).toBe('At')
      expect(getPieceNameTurkish('B')).toBe('Fil')
      expect(getPieceNameTurkish('b')).toBe('Fil')
      expect(getPieceNameTurkish('R')).toBe('Kale')
      expect(getPieceNameTurkish('r')).toBe('Kale')
      expect(getPieceNameTurkish('Q')).toBe('Vezir')
      expect(getPieceNameTurkish('q')).toBe('Vezir')
      expect(getPieceNameTurkish('K')).toBe('Kral')
      expect(getPieceNameTurkish('k')).toBe('Kral')
    })

    it('returns piece as fallback', () => {
      expect(getPieceNameTurkish('X')).toBe('X')
    })
  })

  describe('isTournamentDraw', () => {
    it('detects 50-move rule (100 halfmove clock)', () => {
      expect(isTournamentDraw(100)).toBe(true)
      expect(isTournamentDraw(101)).toBe(true)
    })

    it('allows game before 50-move rule', () => {
      expect(isTournamentDraw(99)).toBe(false)
      expect(isTournamentDraw(50)).toBe(false)
      expect(isTournamentDraw(0)).toBe(false)
    })
  })

  describe('getMaterialDifference', () => {
    it('calculates white advantage with piece array', () => {
      const whiteCaptured = [{ piece: 'p' }, { piece: 'n' }]
      const blackCaptured = [{ piece: 'p' }]
      const diff = getMaterialDifference(whiteCaptured, blackCaptured)
      expect(diff).toBe(3) // 1 + 3 - 1 = 3
    })

    it('calculates white advantage with string array', () => {
      const whiteCaptured = ['p', 'n']
      const blackCaptured = ['p']
      const diff = getMaterialDifference(whiteCaptured, blackCaptured)
      expect(diff).toBe(3)
    })

    it('handles empty captures', () => {
      const diff = getMaterialDifference([], [])
      expect(diff).toBe(0)
    })

    it('detects black advantage', () => {
      const whiteCaptured = [{ piece: 'p' }]
      const blackCaptured = [{ piece: 'q' }]
      const diff = getMaterialDifference(whiteCaptured, blackCaptured)
      expect(diff).toBe(1 - 9) // -8
    })

    it('calculates complex position', () => {
      const whiteCaptured = [{ piece: 'p' }, { piece: 'p' }, { piece: 'n' }]
      const blackCaptured = [{ piece: 'p' }, { piece: 'r' }]
      const diff = getMaterialDifference(whiteCaptured, blackCaptured)
      expect(diff).toBe((1 + 1 + 3) - (1 + 5)) // 5 - 6 = -1
    })
  })

  describe('getPositionEvaluation', () => {
    it('evaluates starting position', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      const eval_result = getPositionEvaluation(fen)
      expect(eval_result.material).toBe(0)
      expect(eval_result.total).toBeDefined()
    })

    it('evaluates position after e4', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      const eval_result = getPositionEvaluation(fen)
      expect(typeof eval_result.material).toBe('number')
      expect(typeof eval_result.position).toBe('number')
      expect(typeof eval_result.total).toBe('number')
    })

    it('detects material imbalance', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/4Q3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1'
      const eval_result = getPositionEvaluation(fen)
      expect(eval_result.material).toBeGreaterThan(0)
    })

    it('returns object with required properties', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      const eval_result = getPositionEvaluation(fen)
      expect(eval_result).toHaveProperty('material')
      expect(eval_result).toHaveProperty('position')
      expect(eval_result).toHaveProperty('total')
    })
  })

  describe('formatFen', () => {
    it('formats valid FEN string', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      const formatted = formatFen(fen)
      expect(formatted).toContain('Beyaz')
      expect(formatted).toContain('Siyah')
    })

    it('returns original if invalid FEN parts', () => {
      const invalidFen = 'invalid fen'
      const formatted = formatFen(invalidFen)
      expect(formatted).toBe(invalidFen)
    })

    it('includes turn information', () => {
      const fenWhiteTurn = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      const formatted = formatFen(fenWhiteTurn)
      expect(formatted).toContain('Beyaz')
    })

    it('includes castling information', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      const formatted = formatFen(fen)
      expect(formatted).toContain('Rokad')
    })
  })

  describe('getSquareNotationFromCoordinates', () => {
    it('converts valid coordinates to notation', () => {
      expect(getSquareNotationFromCoordinates(0, 0)).toBe('a1')
      expect(getSquareNotationFromCoordinates(7, 7)).toBe('h8')
      expect(getSquareNotationFromCoordinates(4, 3)).toBe('e4')
    })

    it('rejects invalid coordinates', () => {
      expect(getSquareNotationFromCoordinates(-1, 0)).toBe('')
      expect(getSquareNotationFromCoordinates(8, 0)).toBe('')
      expect(getSquareNotationFromCoordinates(0, -1)).toBe('')
      expect(getSquareNotationFromCoordinates(0, 8)).toBe('')
    })

    it('handles all valid squares', () => {
      for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
          const notation = getSquareNotationFromCoordinates(file, rank)
          expect(notation.length).toBe(2)
          expect(notation[0]).toMatch(/[a-h]/)
          expect(notation[1]).toMatch(/[1-8]/)
        }
      }
    })
  })

  describe('getCoordinatesFromSquareNotation', () => {
    it('converts valid notation to coordinates', () => {
      const result = getCoordinatesFromSquareNotation('a1')
      expect(result).toEqual({ file: 0, rank: 0 })

      const result2 = getCoordinatesFromSquareNotation('h8')
      expect(result2).toEqual({ file: 7, rank: 7 })
    })

    it('returns null for invalid notation', () => {
      expect(getCoordinatesFromSquareNotation('invalid')).toBeNull()
      expect(getCoordinatesFromSquareNotation('')).toBeNull()
      expect(getCoordinatesFromSquareNotation('a')).toBeNull()
      expect(getCoordinatesFromSquareNotation('i9')).toBeNull()
    })

    it('handles all valid squares', () => {
      for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
          const notation = String.fromCharCode(97 + file) + (rank + 1)
          const result = getCoordinatesFromSquareNotation(notation)
          expect(result).toEqual({ file, rank })
        }
      }
    })
  })

  describe('getGameStatusMessage', () => {
    it('returns checkmate message', () => {
      const msg = getGameStatusMessage('checkmate', 'w')
      expect(msg).toContain('kazandı')
      expect(msg).toContain('Şah Matt')
    })

    it('returns stalemate message', () => {
      const msg = getGameStatusMessage('stalemate', 'b')
      expect(msg).toContain('berabere')
      expect(msg).toContain('Pat')
    })

    it('returns check message', () => {
      const msg = getGameStatusMessage('check', 'w')
      expect(msg).toContain('Beyaz')
      expect(msg).toContain('Şah')
    })

    it('returns playing message', () => {
      const msg = getGameStatusMessage('playing', 'b')
      expect(msg).toContain('sırada')
    })

    it('shows correct turn in message', () => {
      const whiteMsg = getGameStatusMessage('check', 'w')
      expect(whiteMsg).toContain('Beyaz')

      const blackMsg = getGameStatusMessage('check', 'b')
      expect(blackMsg).toContain('Siyah')
    })
  })

  describe('Round-trip Conversions', () => {
    it('square notation round-trip', () => {
      const original = 'e4'
      const coords = getCoordinatesFromSquareNotation(original)
      expect(coords).not.toBeNull()
      const notation = getSquareNotationFromCoordinates(coords!.file, coords!.rank)
      expect(notation).toBe(original)
    })

    it('coordinates round-trip', () => {
      const file = 4
      const rank = 3
      const notation = coordinatesToSquare(file, rank)
      const coords = squareToCoordinates(notation)
      expect(coords.file).toBe(file)
      expect(coords.rank).toBe(rank)
    })
  })
})
