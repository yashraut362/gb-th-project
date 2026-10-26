import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartConfig = {
  actual: { label: 'Actual', color: 'oklch(0.55 0.17 250)' },
  forecast: { label: 'Forecast', color: 'oklch(0.7 0.17 50)' },
}

const dateTime = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})
const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

export default function WindChart({ points }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
      <LineChart data={points} margin={{ left: 4, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          ticks={points.filter((p) => new Date(p.time).getUTCHours() === 0).map((p) => p.time)}
          tickFormatter={(value) => day.format(new Date(value))}
          minTickGap={40}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tickFormatter={(value) => `${value / 1000}k`} width={36} tickLine={false} axisLine={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value, payload) =>
                `${dateTime.format(new Date(value))} UTC · forecast from ${dateTime.format(new Date(payload[0].payload.published))}`
              }
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line dataKey="forecast" stroke="var(--color-forecast)" strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  )
}
