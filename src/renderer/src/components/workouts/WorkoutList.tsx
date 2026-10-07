import type { getWorkoutListRows } from '../../lib/workoutDraft'
import WorkoutCard from './WorkoutCard'

export default function WorkoutList({
  rows,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete
}: {
  rows: ReturnType<typeof getWorkoutListRows>
  loading: boolean
  error: string
  onRetry: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}): React.JSX.Element {
  return (
    <section aria-labelledby="saved-workouts-heading">
      <h2 id="saved-workouts-heading" className="mb-4 text-lg font-semibold">
        Your workouts
      </h2>
      {loading ? (
        <p className="text-sm text-text-secondary">Loading workouts…</p>
      ) : error ? (
        <div role="alert" className="text-sm text-red-300">
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 cursor-pointer underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground"
          >
            Retry
          </button>
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-text-secondary">
          No workouts yet. Create one to plan your training.
        </p>
      ) : (
        <ul className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {rows.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  )
}
