import React from 'react'
import { render, screen } from '@testing-library/react'
import { Game } from '../Game'

describe('Game Component', () => {
  it('renders the chess board', () => {
    render(<Game />)
    expect(screen.getByText(/Oyun Durumu/)).toBeInTheDocument()
  })

  it('displays game status', () => {
    render(<Game />)
    expect(screen.getByText(/Beyaz oyuncu sırada/)).toBeInTheDocument()
  })

  it('renders reset button', () => {
    render(<Game />)
    expect(screen.getByText(/Baştan Başla/)).toBeInTheDocument()
  })

  it('renders move history section', () => {
    render(<Game />)
    expect(screen.getByText(/Hamle Geçmişi/)).toBeInTheDocument()
  })
})
