import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getWind } from '@/api/wind'
import App from './App'

vi.mock('@/api/wind', () => ({ getWind: vi.fn() }))

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  )
}

describe('App', () => {
  it('loads the default range and shows the metrics', async () => {
    getWind.mockResolvedValue({
      points: [{ time: '2026-01-01T00:00:00+00:00', published: '2025-12-31T19:30:00+00:00', actual: 9000, forecast: 9500 }],
      metrics: { mae: 1766.1, rmse: 2253.1, bias: -1563.9, p90_abs_error: 3707.5 },
    })

    renderApp()

    expect(await screen.findByText('1,766')).toBeInTheDocument()
    expect(screen.getByText('2,253')).toBeInTheDocument()
    expect(screen.getByText('-1,564')).toBeInTheDocument()
    expect(screen.getByText('3,708')).toBeInTheDocument()
    expect(screen.getByText('1 hours, 2026-01-01 to 2026-01-07')).toBeInTheDocument()
    expect(getWind).toHaveBeenCalledWith({ start: '2026-01-01', end: '2026-01-07', horizonH: 4 })
  })

  it('shows an error when the API fails', async () => {
    getWind.mockRejectedValue(new Error('Request failed (500)'))

    renderApp()

    expect(await screen.findByText('Could not load data: Request failed (500)')).toBeInTheDocument()
  })
})
