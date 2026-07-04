import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useWeather } from './useWeather'
import { api } from '../services/api'

vi.mock('../services/api')

const mockApi = vi.mocked(api)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useWeather', () => {
  it('should start with loading state', () => {
    mockApi.weatherCurrent.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useWeather())

    expect(result.current.loading).toBe(true)
    expect(result.current.weather).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should return weather data on success', async () => {
    const mockWeather = {
      id: 1,
      forecastDate: '2025-07-01',
      temperatureMean: 26,
      temperatureMax: 30,
      temperatureMin: 22,
    }
    mockApi.weatherCurrent.mockResolvedValue(mockWeather as any)

    const { result } = renderHook(() => useWeather())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.weather).toEqual(mockWeather)
    expect(result.current.error).toBeNull()
  })

  it('should handle error', async () => {
    mockApi.weatherCurrent.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useWeather())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.weather).toBeNull()
    expect(result.current.error).toBe('Network error')
  })

  it('should refetch data', async () => {
    const mockWeather = { id: 1, forecastDate: '2025-07-01' }
    mockApi.weatherCurrent.mockResolvedValue(mockWeather as any)

    const { result } = renderHook(() => useWeather())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    mockApi.weatherCurrent.mockResolvedValue({ id: 2, forecastDate: '2025-07-02' } as any)
    result.current.refetch()

    await waitFor(() => {
      expect(result.current.weather?.id).toBe(2)
    })
  })
})
