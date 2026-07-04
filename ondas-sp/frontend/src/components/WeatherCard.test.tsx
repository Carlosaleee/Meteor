import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeatherCard } from './WeatherCard'
import type { WeatherData } from '../types'

const mockWeatherData: WeatherData = {
  id: 1,
  forecastDate: '2025-07-01',
  fetchedAt: '2025-07-01T12:00:00Z',
  temperatureMax: 30,
  temperatureMin: 22,
  temperatureMean: 26,
  precipitationSum: 0,
  windSpeedMax: 15,
  windDirection: 180,
  cloudCover: 20,
  humidity: 75,
  uvIndex: 6,
  weatherCode: '2',
}

describe('WeatherCard', () => {
  it('should render temperature mean', () => {
    render(<WeatherCard data={mockWeatherData} />)
    expect(screen.getByText('26°')).toBeInTheDocument()
  })

  it('should render weather description for code 2', () => {
    render(<WeatherCard data={mockWeatherData} />)
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument()
  })

  it('should render max and min temperatures', () => {
    render(<WeatherCard data={mockWeatherData} />)
    expect(screen.getByText('30°')).toBeInTheDocument()
    expect(screen.getByText('22°')).toBeInTheDocument()
  })

  it('should render humidity', () => {
    render(<WeatherCard data={mockWeatherData} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('should render wind speed', () => {
    render(<WeatherCard data={mockWeatherData} />)
    expect(screen.getByText('15 km/h')).toBeInTheDocument()
  })

  it('should render UV level', () => {
    render(<WeatherCard data={mockWeatherData} />)
    expect(screen.getByText(/UV Alto/)).toBeInTheDocument()
  })

  it('should render precipitation', () => {
    render(<WeatherCard data={mockWeatherData} />)
    expect(screen.getByText('0mm')).toBeInTheDocument()
  })

  it('should handle null values gracefully', () => {
    const emptyData: WeatherData = {
      ...mockWeatherData,
      temperatureMean: null,
      temperatureMax: null,
      temperatureMin: null,
      humidity: null,
      windSpeedMax: null,
      uvIndex: null,
      precipitationSum: null,
      weatherCode: null,
    }

    render(<WeatherCard data={emptyData} />)
    const dashes = screen.getAllByText('--')
    expect(dashes.length).toBeGreaterThanOrEqual(1)
  })

  it('should show thunderstorm icon for code 95', () => {
    const stormData = { ...mockWeatherData, weatherCode: '95' }
    render(<WeatherCard data={stormData} />)
    expect(screen.getByText('Tempestade')).toBeInTheDocument()
  })

  it('should show rain icon for code 61', () => {
    const rainData = { ...mockWeatherData, weatherCode: '61' }
    render(<WeatherCard data={rainData} />)
    expect(screen.getByText('Chuva leve')).toBeInTheDocument()
  })

  it('should render section heading', () => {
    render(<WeatherCard data={mockWeatherData} />)
    expect(screen.getByText('Previsão do Tempo')).toBeInTheDocument()
  })
})
