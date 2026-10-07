import { useEffect, useRef, useState } from 'react'
import type { Workout } from '../../../shared/types'
import { getWorkoutListRows, type WorkoutListRow } from '../lib/workoutDraft'

export function useWorkoutList(): {
  rows: WorkoutListRow[]
  loading: boolean
  loadError: string
  creating: boolean
  editing: Workout | null
  deleting: Workout | null
  deletingBusy: boolean
  deleteError: string
  toast: { message: string } | null
  dismissToast: (restoreFocus: boolean) => void
  setToastFocused: (focused: boolean) => void
  retry: () => void
  openCreator: () => void
  closeCreator: () => void
  openEditor: (id: number) => void
  closeEditor: () => void
  openDelete: (id: number) => void
  closeDelete: () => void
  confirmDelete: () => Promise<void>
  handleSaved: (workout: Workout) => void
} {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Workout | null>(null)
  const [deleting, setDeleting] = useState<Workout | null>(null)
  const [deletingBusy, setDeletingBusy] = useState(false)
  const deletingRef = useRef(false)
  const [deleteError, setDeleteError] = useState('')
  const [toast, setToast] = useState<{ message: string } | null>(null)
  const [toastFocused, setToastFocused] = useState(false)

  useEffect(() => {
    let cancelled = false
    window.api
      .listWorkouts()
      .then((result) => {
        if (cancelled) return
        if (result.success) setWorkouts(result.data)
        else setLoadError(result.error)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setLoadError('Could not load workouts. Please try again.')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reloadCount])

  useEffect(() => {
    if (!toast || toastFocused) return
    const timeout = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [toast, toastFocused])

  function dismissToast(restoreFocus: boolean): void {
    setToast(null)
    setToastFocused(false)
    if (restoreFocus) {
      requestAnimationFrame(() => document.getElementById('create-workout-button')?.focus())
    }
  }

  function retry(): void {
    setLoading(true)
    setLoadError('')
    setReloadCount((count) => count + 1)
  }

  function openCreator(): void {
    setCreating(true)
    setToast(null)
    setToastFocused(false)
  }

  function closeCreator(): void {
    setCreating(false)
  }

  function openEditor(id: number): void {
    setEditing(workouts.find((workout) => workout.id === id) ?? null)
    setToast(null)
    setToastFocused(false)
  }

  function closeEditor(): void {
    setEditing(null)
  }

  function openDelete(id: number): void {
    setDeleting(workouts.find((workout) => workout.id === id) ?? null)
    setDeleteError('')
    setToast(null)
    setToastFocused(false)
  }

  function closeDelete(): void {
    if (deletingRef.current) return
    setDeleting(null)
    setDeleteError('')
  }

  async function confirmDelete(): Promise<void> {
    if (!deleting || deletingRef.current) return
    deletingRef.current = true
    setDeletingBusy(true)
    setDeleteError('')
    try {
      const result = await window.api.deleteWorkout(deleting.id)
      if (result.success) {
        const index = workouts.findIndex((workout) => workout.id === deleting.id)
        const nextWorkout = workouts[index + 1] ?? workouts[index - 1]
        setWorkouts((current) => current.filter((workout) => workout.id !== deleting.id))
        setDeleting(null)
        setToast({ message: `“${deleting.name}” deleted.` })
        setToastFocused(false)
        requestAnimationFrame(() => {
          const nextButton = nextWorkout
            ? document.getElementById(`workout-${nextWorkout.id}-edit`)
            : null
          const focusTarget = nextButton ?? document.getElementById('create-workout-button')
          focusTarget?.focus()
        })
      } else {
        setDeleteError(result.error)
      }
    } catch {
      setDeleteError('Could not delete workout. Please try again.')
    } finally {
      deletingRef.current = false
      setDeletingBusy(false)
    }
  }

  function handleSaved(workout: Workout): void {
    setWorkouts((current) =>
      editing
        ? current.map((saved) => (saved.id === workout.id ? workout : saved))
        : [workout, ...current]
    )
    setCreating(false)
    setEditing(null)
    setToast({ message: `“${workout.name}” saved.` })
    setToastFocused(false)
  }

  return {
    rows: getWorkoutListRows(workouts),
    loading,
    loadError,
    creating,
    editing,
    deleting,
    deletingBusy,
    deleteError,
    toast,
    dismissToast,
    setToastFocused,
    retry,
    openCreator,
    closeCreator,
    openEditor,
    closeEditor,
    openDelete,
    closeDelete,
    confirmDelete,
    handleSaved
  }
}
