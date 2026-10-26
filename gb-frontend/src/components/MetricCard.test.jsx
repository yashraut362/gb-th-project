import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MetricCard from './MetricCard'

describe('MetricCard', () => {
  it('shows the value rounded to whole MW with separators', () => {
    render(<MetricCard label="Bias" value={-1563.9} hint="hint" />)

    expect(screen.getByText('Bias')).toBeInTheDocument()
    expect(screen.getByText('-1,564')).toBeInTheDocument()
  })

  it('shows a dash when there is no value', () => {
    render(<MetricCard label="MAE" value={null} hint="hint" />)

    expect(screen.getByText('–')).toBeInTheDocument()
  })
})
