import { Minus, Plus } from 'lucide-react'

interface NumberStepperProps {
  id: string
  label: string
  value: string
  min: number
  max: number
  valid: boolean
  onChange: (value: string) => void
  onBlur: () => void
  onStep: (direction: -1 | 1) => void
}

export default function NumberStepper({
  id,
  label,
  value,
  min,
  max,
  valid,
  onChange,
  onBlur,
  onStep
}: NumberStepperProps): React.JSX.Element {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm text-text-secondary">
          {label}
        </label>
        <div className="flex shrink-0 items-center rounded-lg border border-white/10 bg-sidebar">
          <button
            type="button"
            aria-label={`Decrease ${label.toLowerCase()}`}
            disabled={valid && Number(value) <= min}
            onClick={() => onStep(-1)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-l-lg text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground disabled:cursor-default disabled:opacity-30"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            id={id}
            type="number"
            min={min}
            max={max}
            step={1}
            required
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            aria-invalid={!valid}
            aria-describedby={!valid ? `${id}-error` : undefined}
            className="h-11 w-14 appearance-textfield bg-transparent text-center text-sm font-semibold tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            aria-label={`Increase ${label.toLowerCase()}`}
            disabled={valid && Number(value) >= max}
            onClick={() => onStep(1)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-r-lg text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground disabled:cursor-default disabled:opacity-30"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      {!valid && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-300">
          Enter a whole number from {min} to {max}.
        </p>
      )}
    </div>
  )
}
