const HOUR = 3_600_000

export function getWind({ start, end, horizonH }) {
  const from = Date.parse(`${start}T00:00:00Z`)
  const to = Date.parse(`${end}T23:00:00Z`)
  const points = []

  for (let t = from; t <= to; t += HOUR) {
    const h = (t - from) / HOUR
    const actual = Math.round(9000 + 5000 * Math.sin(h / 20) + 1500 * Math.sin(h / 5))
    const miss = (0.3 + horizonH / 48) * 2500 * Math.sin(h / 7 + 1)
    points.push({
      time: new Date(t).toISOString(),
      published: new Date(t - (horizonH + 1.5) * HOUR).toISOString(),
      actual,
      forecast: Math.round(actual + miss + 1500),
    })
  }

  return { points, metrics: points.length ? computeMetrics(points) : null }
}

function computeMetrics(points) {
  const errors = points.map((p) => p.actual - p.forecast)
  const abs = errors.map(Math.abs).sort((a, b) => a - b)
  const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length
  return {
    mae: mean(abs),
    rmse: Math.sqrt(mean(errors.map((e) => e * e))),
    bias: mean(errors),
    p90_abs_error: abs[Math.floor(0.9 * (abs.length - 1))],
  }
}
