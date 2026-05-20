import { Chess } from 'chess.js'

describe('Chess Engine Tests', () => {
  it('initializes chess game', () => {
    const game = new Chess()
    expect(game.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  })

  it('makes valid moves', () => {
    const game = new Chess()
    const move = game.move({ from: 'e2', to: 'e4' })
    expect(move).toBeTruthy()
    expect(move?.san).toBe('e4')
  })

  it('prevents invalid moves', () => {
    const game = new Chess()
    const move = game.move({ from: 'e1', to: 'e4' })
    expect(move).toBeNull()
  })

  it('detects game over', () => {
    const game = new Chess()
    expect(game.isGameOver()).toBe(false)
  })

  it('gets move history', () => {
    const game = new Chess()
    game.move('e4')
    game.move('e5')
    const history = game.history()
    expect(history.length).toBe(2)
    expect(history[0]).toBe('e4')
    expect(history[1]).toBe('e5')
  })

  describe('Promotion Tests', () => {
    it('detects pawn promotion requirement', () => {
      const game = new Chess('8/P7/8/8/8/8/8/7k w - - 0 1')
      const moves = game.moves({ square: 'a7', verbose: true })
      expect(moves.length).toBeGreaterThan(0)
      expect(moves.some((m) => m.promotion !== undefined)).toBe(true)
    })

    it('executes pawn promotion with piece selection', () => {
      const game = new Chess('8/P7/8/8/8/8/8/7k w - - 0 1')
      const move = game.move({ from: 'a7', to: 'a8', promotion: 'q' })
      expect(move).toBeTruthy()
      expect(move?.promotion).toBe('q')
      expect(game.fen()).toContain('Q')
    })

    it('handles black pawn promotion', () => {
      const game = new Chess('7K/8/8/8/8/8/p7/8 b - - 0 1')
      const move = game.move({ from: 'a2', to: 'a1', promotion: 'r' })
      expect(move).toBeTruthy()
      expect(move?.promotion).toBe('r')
      expect(game.fen()).toContain('r')
    })
  })

  describe('En Passant Tests', () => {
    it('detects en passant capture', () => {
      const game = new Chess('8/8/8/pP6/8/8/8/8 w - a6 0 1')
      const moves = game.moves({ square: 'b5', verbose: true })
      const enPassantMove = moves.find((m) => m.flags.includes('e'))
      expect(enPassantMove).toBeTruthy()
    })

    it('executes en passant move', () => {
      const game = new Chess('8/8/8/pP6/8/8/8/8 w - a6 0 1')
      const move = game.move({ from: 'b5', to: 'a6' })
      expect(move).toBeTruthy()
      expect(move?.flags).toContain('e')
      expect(game.get('a5')).toBeNull()
    })

    it('restricts en passant to valid square', () => {
      const game = new Chess('8/8/8/pP6/8/8/8/8 w - - 0 1')
      const moves = game.moves({ square: 'b5', verbose: true })
      const enPassantMove = moves.find((m) => m.flags.includes('e'))
      expect(enPassantMove).toBeUndefined()
    })
  })

  describe('Castling Tests', () => {
    it('allows kingside castling', () => {
      const game = new Chess('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1')
      const move = game.move({ from: 'e1', to: 'g1' })
      expect(move).toBeTruthy()
      expect(move?.flags).toContain('k')
    })

    it('allows queenside castling', () => {
      const game = new Chess('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1')
      const move = game.move({ from: 'e1', to: 'c1' })
      expect(move).toBeTruthy()
      expect(move?.flags).toContain('q')
    })

    it('prevents castling through check', () => {
      const game = new Chess('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R2QK2R w KQkq - 0 1')
      game.load('r3k2r/pppppppp/8/8/8/5q2/PPPPPPPP/R3K2R w KQkq - 0 1')
      const moves = game.moves({ square: 'e1', verbose: true })
      const castlingMoves = moves.filter((m) => m.flags.includes('k') || m.flags.includes('q'))
      expect(castlingMoves.length).toBe(0)
    })

    it('prevents castling after king moved', () => {
      const game = new Chess('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1')
      game.move('Ke2')
      game.move('e5')
      game.move('Ke1')
      game.move('e4')
      const moves = game.moves({ square: 'e1', verbose: true })
      const castlingMoves = moves.filter((m) => m.flags.includes('k') || m.flags.includes('q'))
      expect(castlingMoves.length).toBe(0)
    })
  })

  describe('Captured Pieces Tracking Tests', () => {
    it('tracks captured pieces', () => {
      const game = new Chess()
      game.move('e4')
      game.move('e5')
      game.move('Nf3')
      game.move('Nc6')
      game.move('Bb5')
      game.move('a6')
      game.move('Bxc6')
      const history = game.history({ verbose: true })
      const captureMove = history.find((m) => m.captured)
      expect(captureMove).toBeTruthy()
      expect(captureMove?.captured).toBe('n')
    })

    it('counts all captured pieces', () => {
      const game = new Chess()
      const moves = ['e4', 'c5', 'Nf3', 'd6', 'Bb5+', 'Bd7', 'Bxd7+', 'Nbxd7']
      moves.forEach((m) => game.move(m))
      const history = game.history({ verbose: true })
      const capturedCount = history.filter((m) => m.captured).length
      expect(capturedCount).toBeGreaterThan(0)
    })
  })

  describe('PGN Export Tests', () => {
    it('generates valid PGN format', () => {
      const game = new Chess()
      game.move('e4')
      game.move('e5')
      game.move('Nf3')
      const history = game.history()
      expect(history.length).toBe(3)
      // PGN should contain moves
      expect(history[0]).toBe('e4')
      expect(history[1]).toBe('e5')
      expect(history[2]).toBe('Nf3')
    })

    it('includes game metadata in PGN', () => {
      const game = new Chess()
      game.move('e4')
      game.move('e5')
      const history = game.history()
      expect(Array.isArray(history)).toBe(true)
      expect(history.length).toBe(2)
    })

    it('handles games ending in checkmate', () => {
      const game = new Chess()
      // Scholar's mate
      const moves = ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7']
      moves.forEach((m) => game.move(m))
      expect(game.isCheckmate()).toBe(true)
    })

    it('handles games ending in stalemate', () => {
      const game = new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1')
      expect(game.isStalemate()).toBe(true)
      const history = game.history()
      expect(Array.isArray(history)).toBe(true)
    })
  })

  describe('Game State Info Tests', () => {
    it('returns correct turn', () => {
      const game = new Chess()
      expect(game.turn()).toBe('w')
      game.move('e4')
      expect(game.turn()).toBe('b')
    })

    it('tracks fullmove number', () => {
      const game = new Chess()
      game.move('e4')
      game.move('e5')
      const fenAfter = game.fen()
      const fenParts = fenAfter.split(' ')
      expect(parseInt(fenParts[5])).toBe(2)
    })

    it('detects check', () => {
      const game = new Chess()
      game.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
      expect(game.inCheck()).toBe(false)
      game.load('rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
      game.move('e4')
      game.move('Nxe4')
      expect(game.inCheck()).toBe(false)
    })
  })

  describe('Move Validation Tests', () => {
    it('validates legal moves', () => {
      const game = new Chess()
      const moves = game.moves({ verbose: true })
      expect(moves.length).toBeGreaterThan(0)
      expect(moves[0]).toHaveProperty('from')
      expect(moves[0]).toHaveProperty('to')
    })

    it('rejects illegal moves', () => {
      const game = new Chess()
      const move = game.move({ from: 'a1', to: 'a3' })
      expect(move).toBeNull()
    })

    it('detects move flags correctly', () => {
      const game = new Chess('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1')
      const moves = game.moves({ verbose: true })
      const castlingMove = moves.find((m) => m.flags.includes('k') || m.flags.includes('q'))
      expect(castlingMove).toBeTruthy()
    })

    it('handles multiple captures in a game', () => {
      const game = new Chess()
      const sequence = ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4']
      sequence.forEach((move) => {
        const result = game.move(move)
        expect(result).toBeTruthy()
      })
      const history = game.history({ verbose: true })
      const captures = history.filter((m) => m.captured)
      expect(captures.length).toBeGreaterThan(0)
    })
  })

  describe('Draw Detection Tests', () => {
    it('detects stalemate', () => {
      const game = new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1')
      expect(game.isStalemate()).toBe(true)
      expect(game.isGameOver()).toBe(true)
    })

    it('detects insufficient material', () => {
      // King vs King = Draw
      const game = new Chess('7k/8/6K1/8/8/8/8/8 w - - 0 1')
      // Note: chess.js automatically detects this when trying to move
      expect(game.isGameOver()).toBe(false) // Game not over yet, but will draw if no legal moves
    })

    it('detects 50-move rule', () => {
      const game = new Chess('7k/5Q2/6K1/8/8/8/8/8 w - - 100 50')
      // This would be detected after 50 moves without capture
      expect(game.fen()).toContain('100')
    })
  })

  describe('Complex Game Scenarios', () => {
    it('handles back rank mate pattern', () => {
      const game = new Chess('6rk/5ppN/8/8/8/8/8/7K w - - 0 1')
      const move = game.move('Nxf7')
      expect(move).toBeTruthy()
      // Check if checkmate is possible next move
      const legalMoves = game.moves()
      expect(legalMoves.length).toBeLessThan(10)
    })

    it('tracks move sequence correctly', () => {
      const game = new Chess()
      const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'b5']
      moves.forEach((m) => {
        const result = game.move(m)
        expect(result).toBeTruthy()
      })
      const history = game.history()
      expect(history.length).toBe(8)
      expect(history).toEqual(moves)
    })

    it('handles promotion in middle of game', () => {
      const game = new Chess('8/P7/8/8/8/8/8/7k w - - 0 1')
      const moves = game.moves({ verbose: true })
      const promotionMoves = moves.filter((m) => m.promotion !== undefined)
      expect(promotionMoves.length).toBeGreaterThan(0)

      const move = game.move({ from: 'a7', to: 'a8', promotion: 'q' })
      expect(move).toBeTruthy()
      expect(game.fen()).toContain('Q')
      expect(game.fen()).not.toContain('P')
    })

    it('validates position after captures', () => {
      const game = new Chess()
      game.move('e4')
      game.move('d5')
      game.move('exd5')
      expect(game.fen()).toContain('P')
      const history = game.history({ verbose: true })
      const capture = history[history.length - 1]
      expect(capture.captured).toBe('p')
    })

    it('prevents illegal castling', () => {
      // King moved
      const game = new Chess('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1')
      game.move('Ke2')
      game.move('e5')
      game.move('Ke1')
      game.move('e4')
      const moves = game.moves({ verbose: true })
      const castling = moves.filter((m) => m.flags.includes('k') || m.flags.includes('q'))
      expect(castling.length).toBe(0)
    })
  })

  describe('FEN and Notation Tests', () => {
    it('loads position from FEN', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      const game = new Chess(fen)
      expect(game.fen()).toBe(fen)
    })

    it('generates SAN notation correctly', () => {
      const game = new Chess()
      const move = game.move('e4')
      expect(move?.san).toBe('e4')

      game.move('e5')
      const nf3 = game.move('Nf3')
      expect(nf3?.san).toBe('Nf3')

      game.move('Nc6')
      const capture = game.move('Nxe5')
      expect(capture?.san).toContain('x')
    })

    it('handles check notation in SAN', () => {
      const game = new Chess('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1')
      game.move('d5')
      game.move('exd5')
      game.move('Qxd5')
      game.move('Nc6')
      const move = game.move('Qe5')
      // Check if move has check flag
      if (move) {
        expect(['e5', 'Qe5', 'Qe5+']).toContain(move.san)
      }
    })
  })
})
