import type { Workout } from '../../../../shared/types'
import { useModalDialog } from '../../hooks/useModalDialog'

export default function DeleteWorkoutDialog({
  workout,
  busy,
  error,
  onClose,
  onConfirm
}: {
  workout: Workout
  busy: boolean
  error: string
  onClose: () => void
  onConfirm: () => void
}): React.JSX.Element {
  const { dialogRef, cancel, handleKeyDown } = useModalDialog(onClose, busy)
  return (
    <dialog
      ref={dialogRef}
      onCancel={cancel}
      onKeyDown={handleKeyDown}
      aria-labelledby="delete-workout-title"
      aria-describedby="delete-workout-description"
      className="m-auto w-[calc(100vw-32px)] max-w-md rounded-2xl border border-white/15 bg-background p-6 text-text-primary shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <h2 id="delete-workout-title" className="text-xl font-semibold">
        Delete workout?
      </h2>
      <p
        id="delete-workout-description"
        className="mt-3 text-sm leading-relaxed text-text-secondary"
      >
        “{workout.name}” will be removed from your workout list. This cannot be undone.
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="min-h-11 cursor-pointer rounded-lg px-4 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-foreground disabled:cursor-default disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="min-h-11 cursor-pointer rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-default disabled:opacity-40"
        >
          {busy ? 'Deleting…' : 'Delete workout'}
        </button>
      </div>
    </dialog>
  )
}
