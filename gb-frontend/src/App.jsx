import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getWind } from '@/api/wind'
import DateRangePicker from '@/components/DateRangePicker'
import MetricCard from '@/components/MetricCard'
import WindChart from '@/components/WindChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

const FIRST_DAY = '2026-01-01'
const LAST_DAY = '2026-02-01'

function App() {
  const [start, setStart] = useState(FIRST_DAY)
  const [end, setEnd] = useState('2026-01-07')
  const [horizonH, setHorizonH] = useState(4)
  const [sliderH, setSliderH] = useState(4)

  const { data, error, isPending } = useQuery({
    queryKey: ['wind', start, end, horizonH],
    queryFn: () => getWind({ start, end, horizonH }),
    placeholderData: keepPreviousData,
  })
  const points = data?.points ?? []
  const metrics = data?.metrics

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 p-4 md:p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">GB wind forecast monitor</h1>
        <p className="text-sm text-muted-foreground">
          National wind generation vs the latest forecast available {horizonH}h before each hour. Elexon BMRS,
          January 2026, times in UTC.
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-6">
          <div className="grid gap-2">
            <Label htmlFor="dates">Delivery dates</Label>
            <DateRangePicker
              id="dates"
              start={start}
              end={end}
              min={FIRST_DAY}
              max={LAST_DAY}
              onChange={(range) => {
                setStart(range.start)
                setEnd(range.end)
              }}
            />
          </div>
          <div className="grid w-full max-w-xs gap-4 pb-2">
            <div className="flex items-center justify-between">
              <Label>Forecast horizon</Label>
              <span className="text-sm tabular-nums">{sliderH}h</span>
            </div>
            <Slider
              value={[sliderH]}
              onValueChange={([value]) => setSliderH(value)}
              onValueCommit={([value]) => setHorizonH(value)}
              min={0}
              max={48}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Mean absolute error" value={metrics?.mae} hint="Typical size of a miss" />
        <MetricCard label="RMSE" value={metrics?.rmse} hint="Weights large misses more" />
        <MetricCard label="Bias" value={metrics?.bias} hint="Actual − forecast; negative = less wind than forecast" />
        <MetricCard label="P90 absolute error" value={metrics?.p90_abs_error} hint="90% of hours miss by less than this" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actual vs forecast</CardTitle>
          <CardDescription>
            {isPending ? 'Loading data from Elexon…' : `${points.length} hours, ${start} to ${end}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Could not load data: {error.message}</p>
          ) : (
            <WindChart points={points} />
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default App
