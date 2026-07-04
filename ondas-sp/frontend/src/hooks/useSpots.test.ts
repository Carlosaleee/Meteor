import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSpots } from './useSpots'
import { api } from '../services/api'

vi.mock('../services/api')

const mockApi = vi.mocked(api)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useSpots', () => {
  it('should start with loading state', () => {
    mockApi.spots.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useSpots())

    expect(result.current.loading).toBe(true)
    expect(result.current.spots).toEqual([])
  })

  it('should return spots on success', async () => {
    const mockSpots = [
      { id: 'pedrinhas', name: 'Pedrinhas', difficulty: 'Intermediário' },
      { id: 'juruvauva', name: 'Dunas do Juruvauva', difficulty: 'Iniciante' },
    ]
    mockApi.spots.mockResolvedValue(mockSpots as any)

    const { result } = renderHook(() => useSpots())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.spots).toHaveLength(2)
    expect(result.current.spots[0].id).toBe('pedrinhas')
  })

  it('should handle null response as empty array', async () => {
    mockApi.spots.mockResolvedValue(null as any)

    const { result } = renderHook(() => useSpots())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.spots).toEqual([])
  })

  it('should handle error', async () => {
    mockApi.spots.mockRejectedValue(new Error('Connection failed'))

    const { result } = renderHook(() => useSpots())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Connection failed')
    expect(result.current.spots).toEqual([])
  })
})
