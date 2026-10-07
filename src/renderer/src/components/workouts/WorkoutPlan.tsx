import { ListOrdered } from 'lucide-react'
import type { useCreateWorkout } from '../../hooks/useCreateWorkout'
import WorkoutExerciseRow from './WorkoutExerciseRow'

type Props = Pick<
  ReturnType<typeof useCreateWorkout>,
  'rows' | 'errors' | 'moveExercise' | 'removeExercise' | 'changeNumber'
>

export default function WorkoutPlan({ rows, ...actions }: Props): React.JSX.Element {
  return (
    <section aria-labelledby="workout-plan-heading" className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <h3 id="workout-plan-heading" className="text-sm font-semibold">
          Workout plan
        </h3>
        <span className="text-xs text-text-secondary" aria-live="polite">
          {rows.length} selected
        </span>
      </div>
      {rows.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <ListOrdered className="h-8 w-8 text-accent-foreground" aria-hidden="true" />
          <p className="text-sm font-medium">Build your exercise order</p>
          <p className="max-w-60 text-xs leading-relaxed text-text-secondary">
            Add exercises from the library, then set your targets and rest times.
          </p>
        </div>
      ) : (
        <ol className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {rows.map((item, index) => (
            <WorkoutExerciseRow
              key={item.key}
              item={item}
              index={index}
              last={index === rows.length - 1}
              {...actions}
            />
          ))}
        </ol>
      )}
    </section>
  )
}
