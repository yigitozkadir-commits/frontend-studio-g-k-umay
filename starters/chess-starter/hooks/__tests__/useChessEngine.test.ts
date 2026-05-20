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
    expect(game.game_over()).toBe(false)
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
})
