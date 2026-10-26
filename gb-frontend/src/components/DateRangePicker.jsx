import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const toIso = (date) => format(date, 'yyyy-MM-dd')

export default function DateRangePicker({ id, start, end, min, max, onChange }) {
  const from = parseISO(start)
  const to = parseISO(end)
  const minDate = parseISO(min)
  const maxDate = parseISO(max)

  const handleSelect = (range) => {
    if (range?.from) onChange({ start: toIso(range.from), end: toIso(range.to ?? range.from) })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button id={id} variant="outline" className="w-60 justify-start font-normal">
          <CalendarIcon />
          {format(from, 'd MMM')} – {format(to, 'd MMM yyyy')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{ from, to }}
          onSelect={handleSelect}
          defaultMonth={from}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={{ before: minDate, after: maxDate }}
          weekStartsOn={1}
        />
      </PopoverContent>
    </Popover>
  )
}
