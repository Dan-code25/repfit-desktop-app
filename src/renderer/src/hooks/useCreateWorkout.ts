import { useRef, useState, type FormEvent, type RefObject } from 'react'
import type { Workout } from '../../../shared/types'
import {
  createWorkoutDraftItem,
  getWorkoutCatalogue,
  getWorkoutDraftRows,
  getSavedWorkoutDraftItems,
  moveWorkoutDraftItem,
  serializeWorkoutDraft,
  validateWorkoutDraft,
  type WorkoutDraftItem,
  type WorkoutNumericField,
  type WorkoutCatalogueEntry,
  type WorkoutDraftRow
} from '../lib/workoutDraft'

export interface CreateWorkoutController {
  name: string
  daysOfWeek: number[]
  group: string
  search: string
  errors: Record<string, string>
  saving: boolean
  errorSummaryRef: RefObject<HTMLDivElement | null>
  errorEntries: [string, string][]
  catalogue: WorkoutCatalogueEntry[]
  rows: WorkoutDraftRow[]
  changeName: (value: string) => void
  toggleDay: (day: number) => void
  addExercise: (exerciseCode: string) => void
  removeExercise: (key: string) => void
  moveExercise: (key: string, direction: -1 | 1) => void
  changeNumber: (key: string, field: WorkoutNumericField, value: string) => void
  focusField: (field: string) => void
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  changeGroup: (value: string) => void
  changeSearch: (value: string) => void
}

export function useCreateWorkout(
  onSaved: (workout: Workout) => void,
  workout?: Workout
): CreateWorkoutController {
  const [name, setName] = useState(workout?.name ?? '')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(workout?.daysOfWeek ?? [1])
  const [group, setGroup] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<WorkoutDraftItem[]>(() =>
    workout ? getSavedWorkoutDraftItems(workout) : []
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  function clearError(field: string): void {
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      delete next.save
      return next
    })
  }

  function showErrors(next: Record<string, string>): void {
    setErrors(next)
    requestAnimationFrame(() => errorSummaryRef.current?.focus())
  }

  function changeName(value: string): void {
    setName(value)
    clearError('workout-name')
  }

  function toggleDay(day: number): void {
    setDaysOfWeek((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day]
    )
    clearError('workout-days')
  }

  function addExercise(exerciseCode: string): void {
    const item = createWorkoutDraftItem(exerciseCode)
    if (!item) return
    setItems((current) => [...current, item])
    clearError('workout-catalogue')
  }

  function removeExercise(key: string): void {
    const index = items.findIndex((item) => item.key === key)
    const focusItem = items[index + 1] ?? items[index - 1]
    setItems((current) => current.filter((item) => item.key !== key))
    // Item numbering changes after removal, so discard old validation messages.
    setErrors({})
    requestAnimationFrame(() =>
      focusField(focusItem ? `${focusItem.key}-row` : 'workout-catalogue')
    )
  }

  function moveExercise(key: string, direction: -1 | 1): void {
    setItems((current) => moveWorkoutDraftItem(current, key, direction))
    setErrors({})
    requestAnimationFrame(() => focusField(`${key}-row`))
  }

  function changeNumber(key: string, field: WorkoutNumericField, value: string): void {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, [field]: value } : item))
    )
    clearError(`${key}-${field}`)
  }

  function focusField(field: string): void {
    document.getElementById(field)?.focus()
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (savingRef.current) return
    const nextErrors = validateWorkoutDraft(name, daysOfWeek, items)
    if (Object.keys(nextErrors).length) {
      showErrors(nextErrors)
      return
    }
    setErrors({})
    savingRef.current = true
    setSaving(true)
    try {
      const input = serializeWorkoutDraft(name, daysOfWeek, items)
      const result = workout
        ? await window.api.updateWorkout(workout.id, input)
        : await window.api.createWorkout(input)
      if (result.success) onSaved(result.data)
      else showErrors({ save: result.error })
    } catch {
      showErrors({ save: 'Could not save workout. Your changes are still here. Try again.' })
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  return {
    name,
    daysOfWeek,
    group,
    search,
    errors,
    saving,
    errorSummaryRef,
    errorEntries: Object.entries(errors),
    catalogue: getWorkoutCatalogue(group, search, items),
    rows: getWorkoutDraftRows(items),
    changeName,
    toggleDay,
    addExercise,
    removeExercise,
    moveExercise,
    changeNumber,
    focusField,
    submit,
    changeGroup: setGroup,
    changeSearch: setSearch
  }
}
