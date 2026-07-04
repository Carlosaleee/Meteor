import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useWaves } from './useWaves'
import { api } from '../services/api'

vi.mock('../services/api')

const mockApi = vi.mocked(api)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useWaves', () => {
  it('should start with loading state', () => {
    mockApi.wavesCurrent.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useWaves())

    expect(result.current.loading).toBe(true)
    expect(result.current.waves).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should return waves data on success', async () => {
    const mockWaves = [
      { id: 1, waveHeight: 1.5, wavePeriod: 10 },
      { id: 2, waveHeight: 1.8, wavePeriod: 11 },
    ]
    mockApi.wavesCurrent.mockResolvedValue(mockWaves as any)

    const { result } = renderHook(() => useWaves())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.waves).toEqual(mockWaves)
    expect(result.current.waves).toHaveLength(2)
  })

  it('should handle empty waves', async () => {
    mockApi.wavesCurrent.mockResolvedValue([])

    const { result } = renderHook(() => useWaves())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.waves).toEqual([])
  })

  it('should handle error', async () => {
    mockApi.wavesCurrent.mockRejectedValue(new Error('API down'))

    const { result } = renderHook(() => useWaves())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('API down')
  })
})
