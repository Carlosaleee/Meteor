import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSurfScore } from './useSurfScore'
import { api } from '../services/api'

vi.mock('../services/api')

const mockApi = vi.mocked(api)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useSurfScore', () => {
  it('should start with loading state', () => {
    mockApi.surfScore.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useSurfScore())

    expect(result.current.loading).toBe(true)
    expect(result.current.score).toBeNull()
  })

  it('should return score on success', async () => {
    const mockScore = { date: '2025-07-01', score: 7.5, level: 'Bom' }
    mockApi.surfScore.mockResolvedValue(mockScore as any)

    const { result } = renderHook(() => useSurfScore())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.score).toEqual(mockScore)
  })

  it('should handle error', async () => {
    mockApi.surfScore.mockRejectedValue(new Error('Service unavailable'))

    const { result } = renderHook(() => useSurfScore())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Service unavailable')
  })
})
