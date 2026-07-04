import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSurfSummary } from './useSurfSummary'
import { api } from '../services/api'

vi.mock('../services/api')

const mockApi = vi.mocked(api)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useSurfSummary', () => {
  it('should start with loading state', () => {
    mockApi.surfSummary.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useSurfSummary())

    expect(result.current.loading).toBe(true)
    expect(result.current.summary).toBeNull()
  })

  it('should return summary on success', async () => {
    const mockSummary = {
      date: '2025-07-01',
      weatherSummary: 'Clima ok',
      waveSummary: 'Ondas boas',
      fullSummary: 'Resumo completo',
      bestTimeToSurf: '14:00',
    }
    mockApi.surfSummary.mockResolvedValue(mockSummary as any)

    const { result } = renderHook(() => useSurfSummary())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.summary).toEqual(mockSummary)
    expect(result.current.summary?.bestTimeToSurf).toBe('14:00')
  })

  it('should handle error', async () => {
    mockApi.surfSummary.mockRejectedValue(new Error('Timeout'))

    const { result } = renderHook(() => useSurfSummary())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Timeout')
  })
})
