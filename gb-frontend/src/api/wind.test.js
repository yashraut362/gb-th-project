import { afterEach, describe, expect, it, vi } from 'vitest'
import { getWind } from './wind'

afterEach(() => vi.unstubAllGlobals())

describe('getWind', () => {
  it('requests /api/wind with the selected range and horizon', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ points: [], metrics: null }) })
    vi.stubGlobal('fetch', fetch)

    const data = await getWind({ start: '2026-01-05', end: '2026-01-06', horizonH: 24 })

    expect(fetch).toHaveBeenCalledWith('/api/wind?start=2026-01-05&end=2026-01-06&horizon_h=24')
    expect(data).toEqual({ points: [], metrics: null })
  })

  it('throws when the API responds with an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400 }))

    await expect(getWind({ start: '2026-01-05', end: '2026-01-02', horizonH: 4 })).rejects.toThrow('400')
  })
})
