import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import type { useCreateWorkout } from '../../hooks/useCreateWorkout'

type Controller = ReturnType<typeof useCreateWorkout>
interface Props extends Pick<
  Controller,
  'errors' | 'moveExercise' | 'removeExercise' | 'changeNumber'
> {
  item: Controller['rows'][number]
  index: number
  last: boolean
}

export default function WorkoutExerciseRow({
  item,
  index,
  last,
  errors,
  moveExercise,
  removeExercise,
  changeNumber
}: Props): React.JSX.Element {
  return (
    <li
      id={`${item.key}-row`}
      tabIndex={-1}
      className="rounded-xl border border-white/10 bg-white/[0.025] p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug">
          <span className="mr-2 text-accent-foreground">{index + 1}.</span>
          {item.name}
        </h4>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label={`Move ${item.name} up`}
            disabled={index === 0}
            onClick={() => moveExercise(item.key, -1)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground disabled:cursor-default disabled:opacity-25"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Move ${item.name} down`}
            disabled={last}
            onClick={() => moveExercise(item.key, 1)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground disabled:cursor-default disabled:opacity-25"
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Remove ${item.name}`}
            onClick={() => removeExercise(item.key)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-text-secondary hover:bg-red-400/10 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {item.fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={`${item.key}-${field.key}`}
              className="mb-1.5 block text-xs text-text-secondary"
            >
              {field.label}
            </label>
            <input
              id={`${item.key}-${field.key}`}
              type="number"
              min={field.min}
              max={field.max}
              step={1}
              required
              value={item[field.key]}
              onChange={(event) => changeNumber(item.key, field.key, event.target.value)}
              aria-invalid={Boolean(errors[`${item.key}-${field.key}`])}
              aria-describedby={
                errors[`${item.key}-${field.key}`] ? `${item.key}-${field.key}-error` : undefined
              }
              className="min-h-10 w-full rounded-lg border border-white/15 bg-sidebar px-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground aria-invalid:border-red-400"
            />
            {errors[`${item.key}-${field.key}`] && (
              <p id={`${item.key}-${field.key}-error`} className="mt-1 text-xs text-red-300">
                {errors[`${item.key}-${field.key}`]}
              </p>
            )}
          </div>
        ))}
      </div>
    </li>
  )
}
