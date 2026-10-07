import type { useCreateWorkout } from '../../hooks/useCreateWorkout'
import { workoutDays } from '../../lib/workoutDraft'

type Props = Pick<
  ReturnType<typeof useCreateWorkout>,
  'name' | 'daysOfWeek' | 'errors' | 'changeName' | 'toggleDay'
>

export default function WorkoutDetailsFields({
  name,
  daysOfWeek,
  errors,
  changeName,
  toggleDay
}: Props): React.JSX.Element {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(180px,1fr)_minmax(0,1.5fr)]">
      <div>
        <label
          htmlFor="workout-name"
          className="mb-2 block text-xs font-medium text-text-secondary"
        >
          Workout name
        </label>
        <input
          id="workout-name"
          value={name}
          onChange={(event) => changeName(event.target.value)}
          required
          maxLength={50}
          autoFocus
          placeholder="e.g. Upper body"
          aria-invalid={Boolean(errors['workout-name'])}
          aria-describedby={errors['workout-name'] ? 'workout-name-error' : undefined}
          className="min-h-11 w-full rounded-lg border border-white/15 bg-sidebar px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground aria-invalid:border-red-400"
        />
        {errors['workout-name'] && (
          <p id="workout-name-error" className="mt-1 text-xs text-red-300">
            {errors['workout-name']}
          </p>
        )}
      </div>
      <div>
        <p id="workout-days-label" className="mb-2 text-xs font-medium text-text-secondary">
          Training days · choose one or more
        </p>
        <div
          id="workout-days"
          role="group"
          aria-labelledby="workout-days-label"
          aria-describedby={errors['workout-days'] ? 'workout-days-error' : undefined}
          tabIndex={-1}
          className="flex flex-wrap gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground"
        >
          {workoutDays.map((day) => (
            <button
              key={day.value}
              type="button"
              aria-label={day.name}
              aria-pressed={daysOfWeek.includes(day.value)}
              onClick={() => toggleDay(day.value)}
              className={`min-h-11 flex-1 cursor-pointer rounded-lg border px-2 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground ${daysOfWeek.includes(day.value) ? 'border-accent/60 bg-accent-surface text-accent-foreground' : 'border-white/10 bg-sidebar text-text-secondary hover:bg-white/5 hover:text-text-primary'}`}
            >
              {day.label}
            </button>
          ))}
        </div>
        {errors['workout-days'] && (
          <p id="workout-days-error" className="mt-1 text-xs text-red-300">
            {errors['workout-days']}
          </p>
        )}
      </div>
    </div>
  )
}
