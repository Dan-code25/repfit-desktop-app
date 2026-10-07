import { Check, Plus, Search } from 'lucide-react'
import PillGroup from '../PillGroup'
import type { useCreateWorkout } from '../../hooks/useCreateWorkout'
import { muscleGroupOptions } from '../../lib/workoutDraft'

type Props = Pick<
  ReturnType<typeof useCreateWorkout>,
  'group' | 'search' | 'catalogue' | 'errors' | 'changeGroup' | 'changeSearch' | 'addExercise'
>

export default function WorkoutExerciseBrowser({
  group,
  search,
  catalogue,
  errors,
  changeGroup,
  changeSearch,
  addExercise
}: Props): React.JSX.Element {
  return (
    <section
      aria-labelledby="workout-catalogue-heading"
      className="flex min-h-0 flex-col border-b border-white/10 bg-sidebar/40 md:border-r md:border-b-0"
    >
      <div className="space-y-3 border-b border-white/5 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 id="workout-catalogue-heading" className="text-sm font-semibold">
            Exercise library
          </h3>
          <span className="text-xs text-text-secondary" aria-live="polite">
            {catalogue.length} available
          </span>
        </div>
        <label className="relative block">
          <span className="sr-only">Search exercises</span>
          <Search
            className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-text-secondary"
            aria-hidden="true"
          />
          <input
            id="workout-catalogue"
            type="search"
            value={search}
            onChange={(event) => changeSearch(event.target.value)}
            placeholder="Search exercises"
            aria-invalid={Boolean(errors['workout-catalogue'])}
            aria-describedby={errors['workout-catalogue'] ? 'workout-catalogue-error' : undefined}
            className="min-h-11 w-full rounded-lg border border-white/10 bg-white/[0.025] pr-3 pl-9 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground aria-invalid:border-red-400"
          />
        </label>
        <PillGroup
          size="sm"
          ariaLabel="Filter workout exercises by muscle group"
          options={muscleGroupOptions}
          value={group}
          onChange={changeGroup}
        />
        {errors['workout-catalogue'] && (
          <p id="workout-catalogue-error" className="text-xs text-red-300">
            {errors['workout-catalogue']}
          </p>
        )}
      </div>
      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
        {catalogue.map((exercise) => (
          <li
            key={exercise.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-3 hover:border-white/5 hover:bg-white/5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug">{exercise.name}</p>
              <p className="mt-1 text-xs text-text-secondary">
                {exercise.muscleLabel}
                {exercise.tracking === 'time' ? ' · Timed' : ''}
              </p>
              {exercise.addedCount > 0 && (
                <p className="mt-1 flex items-center gap-1 text-xs text-accent-foreground">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Added{exercise.addedCount > 1 ? ` ×${exercise.addedCount}` : ''}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label={`Add ${exercise.name}`}
              onClick={() => addExercise(exercise.id)}
              className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs font-medium hover:border-accent/50 hover:bg-accent-surface hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add
            </button>
          </li>
        ))}
      </ul>
      {catalogue.length === 0 && (
        <p className="p-4 text-sm text-text-secondary">
          No exercises match. Try another filter or search.
        </p>
      )}
    </section>
  )
}
