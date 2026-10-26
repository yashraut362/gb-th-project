import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const mw = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0, signDisplay: 'auto' })

export default function MetricCard({ label, value, hint }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">
          {value == null ? '–' : mw.format(value)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">MW</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{hint}</CardContent>
    </Card>
  )
}
