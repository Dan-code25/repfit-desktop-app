import { Plus } from 'lucide-react'
import CreateWorkoutModal from '../components/workouts/CreateWorkoutModal'
import DeleteWorkoutDialog from '../components/workouts/DeleteWorkoutDialog'
import WorkoutList from '../components/workouts/WorkoutList'
import WorkoutToast from '../components/workouts/WorkoutToast'
import { useWorkoutList } from '../hooks/useWorkoutList'

function TrainPage(): React.JSX.Element {
  const workouts = useWorkoutList()
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Train</h1>
        <button
          id="create-workout-button"
          type="button"
          disabled={workouts.loading}
          onClick={workouts.openCreator}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground disabled:cursor-default disabled:opacity-40"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create workout
        </button>
      </header>
      {workouts.toast && (
        <WorkoutToast
          message={workouts.toast.message}
          onDismiss={workouts.dismissToast}
          onFocusChange={workouts.setToastFocused}
        />
      )}
      {workouts.creating && (
        <CreateWorkoutModal onClose={workouts.closeCreator} onSaved={workouts.handleSaved} />
      )}
      {workouts.editing && (
        <CreateWorkoutModal
          key={workouts.editing.id}
          workout={workouts.editing}
          onClose={workouts.closeEditor}
          onSaved={workouts.handleSaved}
        />
      )}
      {workouts.deleting && (
        <DeleteWorkoutDialog
          workout={workouts.deleting}
          busy={workouts.deletingBusy}
          error={workouts.deleteError}
          onClose={workouts.closeDelete}
          onConfirm={workouts.confirmDelete}
        />
      )}
      <WorkoutList
        rows={workouts.rows}
        loading={workouts.loading}
        error={workouts.loadError}
        onRetry={workouts.retry}
        onEdit={workouts.openEditor}
        onDelete={workouts.openDelete}
      />
    </div>
  )
}

export default TrainPage
