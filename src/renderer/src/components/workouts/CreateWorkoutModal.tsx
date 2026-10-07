import { X } from 'lucide-react'
import type { Workout } from '../../../../shared/types'
import { useCreateWorkout } from '../../hooks/useCreateWorkout'
import { useModalDialog } from '../../hooks/useModalDialog'
import WorkoutDetailsFields from './WorkoutDetailsFields'
import WorkoutExerciseBrowser from './WorkoutExerciseBrowser'
import WorkoutPlan from './WorkoutPlan'

interface CreateWorkoutModalProps {
  workout?: Workout
  onSaved: (workout: Workout) => void
  onClose: () => void
}

export default function CreateWorkoutModal({
  workout,
  onSaved,
  onClose
}: CreateWorkoutModalProps): React.JSX.Element {
  const form = useCreateWorkout(onSaved, workout)
  const { dialogRef, cancel, handleKeyDown } = useModalDialog(onClose, form.saving)
  return (
    <dialog
      ref={dialogRef}
      onCancel={cancel}
      onKeyDown={handleKeyDown}
      aria-labelledby="create-workout-title"
      className="m-auto h-[min(760px,calc(100dvh-32px))] max-h-none w-[calc(100vw-32px)] max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-background p-0 text-text-primary shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <form noValidate onSubmit={form.submit} className="h-full">
        <fieldset disabled={form.saving} className="flex h-full min-w-0 flex-col">
          <header className="shrink-0 space-y-4 border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <h2 id="create-workout-title" className="text-xl font-semibold">
                {workout ? 'Edit workout' : 'Create workout'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={workout ? 'Close edit workout' : 'Close create workout'}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <WorkoutDetailsFields
              name={form.name}
              daysOfWeek={form.daysOfWeek}
              errors={form.errors}
              changeName={form.changeName}
              toggleDay={form.toggleDay}
            />
          </header>
          <div className="grid min-h-0 flex-1 grid-rows-2 md:grid-cols-[minmax(240px,0.85fr)_minmax(0,1.35fr)] md:grid-rows-1">
            <WorkoutExerciseBrowser
              group={form.group}
              search={form.search}
              catalogue={form.catalogue}
              errors={form.errors}
              changeGroup={form.changeGroup}
              changeSearch={form.changeSearch}
              addExercise={form.addExercise}
            />
            <WorkoutPlan
              rows={form.rows}
              errors={form.errors}
              moveExercise={form.moveExercise}
              removeExercise={form.removeExercise}
              changeNumber={form.changeNumber}
            />
          </div>
          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
            <p className="text-xs text-text-secondary">Rest applies after each set.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 cursor-pointer rounded-lg px-4 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-11 cursor-pointer rounded-lg bg-accent px-5 text-sm font-medium text-white hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground"
              >
                {form.saving ? 'Saving…' : workout ? 'Save changes' : 'Save workout'}
              </button>
            </div>
          </footer>
        </fieldset>
      </form>
    </dialog>
  )
}
