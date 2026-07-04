import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from './api'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

describe('api', () => {
  describe('fetchJson', () => {
    it('should fetch weather current data', async () => {
      const mockData = { id: 1, forecastDate: '2025-07-01', temperatureMean: 26 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      const result = await api.weatherCurrent()
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('/api/weather/current')
    })

    it('should return null for 204 No Content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.resolve(null),
      })

      const result = await api.weatherCurrent()
      expect(result).toBeNull()
    })

    it('should throw error for non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      await expect(api.weatherCurrent()).rejects.toThrow('API error: 500')
    })

    it('should fetch weather hourly with date param', async () => {
      const mockData = [{ id: 1, forecastDate: '2025-07-01' }]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      const result = await api.weatherHourly('2025-07-01')
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('/api/weather/hourly?date=2025-07-01')
    })

    it('should fetch waves current data', async () => {
      const mockData = [{ id: 1, waveHeight: 1.5 }]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      const result = await api.wavesCurrent()
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('/api/waves/current')
    })

    it('should fetch surf score', async () => {
      const mockData = { date: '2025-07-01', score: 7.5, level: 'Bom' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      const result = await api.surfScore()
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('/api/surf/score')
    })

    it('should fetch surf score with date param', async () => {
      const mockData = { date: '2025-07-01', score: 8 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      await api.surfScore('2025-07-01')
      expect(mockFetch).toHaveBeenCalledWith('/api/surf/score?date=2025-07-01')
    })

    it('should fetch surf summary', async () => {
      const mockData = { date: '2025-07-01', fullSummary: 'Resumo' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      const result = await api.surfSummary()
      expect(result).toEqual(mockData)
    })

    it('should fetch spots', async () => {
      const mockData = [{ id: 'pedrinhas', name: 'Pedrinhas' }]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      const result = await api.spots()
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('/api/spots')
    })

    it('should fetch health status', async () => {
      const mockData = { status: 'UP', service: 'ondas-sp' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      const result = await api.health()
      expect(result).toEqual(mockData)
    })
  })

  describe('postJson', () => {
    it('should call sync endpoint', async () => {
      const mockData = { success: true, message: 'All data synchronized' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      })

      const result = await api.sync()
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('/api/sync', { method: 'POST' })
    })

    it('should throw error for sync failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      await expect(api.sync()).rejects.toThrow('API error: 500')
    })
  })
})
