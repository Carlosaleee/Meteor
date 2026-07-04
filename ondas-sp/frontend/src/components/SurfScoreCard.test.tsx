import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SurfScoreCard } from './SurfScoreCard'
import type { SurfScore } from '../types'

const mockScore: SurfScore = {
  date: '2025-07-01',
  bestTime: '14:00',
  score: 7.5,
  level: 'Bom',
  recommendation: 'Boas condições para surfar.',
}

describe('SurfScoreCard', () => {
  it('should render score level', () => {
    render(<SurfScoreCard data={mockScore} />)
    expect(screen.getByText('Bom')).toBeInTheDocument()
  })

  it('should render best time', () => {
    render(<SurfScoreCard data={mockScore} />)
    expect(screen.getByText('14:00h')).toBeInTheDocument()
  })

  it('should render recommendation', () => {
    render(<SurfScoreCard data={mockScore} />)
    expect(screen.getByText('Boas condições para surfar.')).toBeInTheDocument()
  })

  it('should render heading', () => {
    render(<SurfScoreCard data={mockScore} />)
    expect(screen.getByText('Score de Surf')).toBeInTheDocument()
  })

  it('should render score out of 10', () => {
    render(<SurfScoreCard data={mockScore} />)
    expect(screen.getByText('/10')).toBeInTheDocument()
  })

  it('should render excellent score with green color', () => {
    const excellentScore = { ...mockScore, score: 9, level: 'Excelente' }
    render(<SurfScoreCard data={excellentScore} />)
    expect(screen.getByText('Excelente')).toBeInTheDocument()
  })

  it('should render bad score with red color', () => {
    const badScore = { ...mockScore, score: 2, level: 'Ruim' }
    render(<SurfScoreCard data={badScore} />)
    expect(screen.getByText('Ruim')).toBeInTheDocument()
  })
})
