export async function getWind({ start, end, horizonH }) {
  const params = new URLSearchParams({ start, end, horizon_h: horizonH })
  const response = await fetch(`/api/wind?${params}`)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json()
}
