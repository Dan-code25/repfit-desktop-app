import { CalendarDays, Pencil, Play, Trash2 } from 'lucide-react'
import type { WorkoutListRow } from '../../lib/workoutDraft'

export default function WorkoutCard({
  workout,
  onEdit,
  onDelete
}: {
  workout: WorkoutListRow
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}): React.JSX.Element {
  return (
    <li className="flex h-[360px] w-full max-w-[520px] flex-col overflow-hidden rounded-xl border border-white/10 bg-sidebar/90 shadow-lg shadow-black/10 transition-[border-color,background-color,box-shadow] duration-200 hover:border-accent/50 hover:bg-sidebar hover:shadow-xl hover:shadow-black/25 motion-reduce:transition-none">
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            title={workout.name}
            className="min-w-0 line-clamp-2 text-lg font-semibold leading-snug break-words text-text-primary"
          >
            {workout.name}
          </h3>
          <div className="-mt-2 -mr-2 flex shrink-0 gap-1">
            <button
              id={`workout-${workout.id}-edit`}
              type="button"
              onClick={() => onEdit(workout.id)}
              aria-label={`Edit ${workout.name}`}
              title={`Edit ${workout.name}`}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(workout.id)}
              aria-label={`Delete ${workout.name}`}
              title={`Delete ${workout.name}`}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-text-secondary hover:bg-red-400/10 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
            {workout.daysLabel}
          </span>
          <span className="inline-flex items-center border-l border-white/15 pl-4">
            {workout.items.length} {workout.items.length === 1 ? 'exercise' : 'exercises'}
          </span>
        </div>
      </div>

      <div className="shrink-0 border-y border-white/10 bg-background/35">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-white/10 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
          <span>Exercise</span>
          <span>Plan · Rest</span>
        </div>
        <ol
          aria-label={`${workout.name} exercises`}
          tabIndex={workout.items.length > 2 ? 0 : undefined}
          className="h-40 divide-y divide-white/[0.07] overflow-y-auto overscroll-contain px-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-foreground"
        >
          {workout.items.map((item) => (
            <li
              key={item.positionLabel}
              className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="w-5 shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-accent-foreground">
                  {item.positionLabel}
                </span>
                <span
                  title={item.name}
                  className="line-clamp-2 text-sm font-medium leading-snug break-words"
                >
                  {item.name}
                </span>
              </div>
              <div className="text-right tabular-nums">
                <p className="text-sm font-medium whitespace-nowrap text-text-primary">
                  {item.sets} × {item.target} {item.targetUnit}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">{item.restSeconds}s rest</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="shrink-0 p-3">
        <button
          type="button"
          disabled
          title="Workout mode is coming soon"
          className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-accent/35 bg-accent-surface px-3 text-sm font-semibold text-accent-foreground opacity-65"
        >
          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
          Start workout
          <span className="rounded border border-accent/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            Soon
          </span>
        </button>
      </div>
    </li>
  )
}
