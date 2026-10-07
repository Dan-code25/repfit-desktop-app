import exercises from '../../../../shared/exercises.json'
import type { CreateWorkoutInput, TargetType, Workout } from '../../../shared/types'
import { capitalize } from './capitalize'

export const workoutDays = [
  { value: 1, label: 'Mon', name: 'Monday' },
  { value: 2, label: 'Tue', name: 'Tuesday' },
  { value: 3, label: 'Wed', name: 'Wednesday' },
  { value: 4, label: 'Thu', name: 'Thursday' },
  { value: 5, label: 'Fri', name: 'Friday' },
  { value: 6, label: 'Sat', name: 'Saturday' },
  { value: 7, label: 'Sun', name: 'Sunday' }
]

export const muscleGroupOptions = [
  { value: '', label: 'All' },
  ...[...new Set(exercises.map(({ muscleGroup }) => muscleGroup))].map((group) => ({
    value: group,
    label: capitalize(group)
  }))
]

export interface WorkoutDraftItem {
  key: string
  exerciseCode: string
  targetType: TargetType
  target: string
  sets: string
  restSeconds: string
}

export type WorkoutNumericField = 'target' | 'sets' | 'restSeconds'

export interface WorkoutCatalogueEntry {
  id: string
  name: string
  muscleGroup: string
  muscleLabel: string
  tracking: string
  addedCount: number
}

export interface WorkoutDraftRow extends WorkoutDraftItem {
  name: string
  fields: ReturnType<typeof getWorkoutItemFields>
}

export interface WorkoutListRow {
  id: number
  name: string
  daysLabel: string
  items: {
    positionLabel: string
    name: string
    sets: number
    target: number
    targetUnit: string
    restSeconds: number
  }[]
}

export function getWorkoutItemFields(item: WorkoutDraftItem): {
  key: WorkoutNumericField
  label: string
  min: number
  max: number
}[] {
  return [
    { key: 'sets', label: 'Sets', min: 1, max: 10 },
    {
      key: 'target',
      label: item.targetType === 'time' ? 'Time (seconds)' : 'Reps',
      min: item.targetType === 'time' ? 5 : 1,
      max: item.targetType === 'time' ? 600 : 100
    },
    { key: 'restSeconds', label: 'Rest (seconds)', min: 0, max: 300 }
  ]
}

export function createWorkoutDraftItem(exerciseCode: string): WorkoutDraftItem | undefined {
  const exercise = exercises.find(({ id }) => id === exerciseCode)
  if (!exercise) return undefined
  const targetType = exercise.tracking === 'time' ? 'time' : 'reps'
  return {
    key: crypto.randomUUID(),
    exerciseCode,
    targetType,
    target: targetType === 'time' ? '30' : '10',
    sets: '3',
    restSeconds: '60'
  }
}

export function getSavedWorkoutDraftItems(workout: Workout): WorkoutDraftItem[] {
  return workout.items.map((item) => ({
    key: crypto.randomUUID(),
    exerciseCode: item.exerciseCode,
    targetType:
      exercises.find(({ id }) => id === item.exerciseCode)?.tracking === 'time' ? 'time' : 'reps',
    target: String(item.target),
    sets: String(item.sets),
    restSeconds: String(item.restSeconds)
  }))
}

export function moveWorkoutDraftItem(
  items: WorkoutDraftItem[],
  key: string,
  direction: -1 | 1
): WorkoutDraftItem[] {
  const index = items.findIndex((item) => item.key === key)
  const destination = index + direction
  if (index < 0 || destination < 0 || destination >= items.length) return items
  const next = [...items]
  next[index] = items[destination]
  next[destination] = items[index]
  return next
}

export function validateWorkoutDraft(
  name: string,
  daysOfWeek: number[],
  items: WorkoutDraftItem[]
): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!name.trim() || name.trim().length > 50) {
    errors['workout-name'] = 'Enter a name between 1 and 50 characters.'
  }
  if (!daysOfWeek.length) errors['workout-days'] = 'Select at least one training day.'
  if (!items.length) errors['workout-catalogue'] = 'Add at least one exercise.'
  items.forEach((item, index) => {
    getWorkoutItemFields(item).forEach((field) => {
      const value = Number(item[field.key])
      if (
        !item[field.key].trim() ||
        !Number.isInteger(value) ||
        value < field.min ||
        value > field.max
      ) {
        errors[`${item.key}-${field.key}`] =
          `Exercise ${index + 1}, ${field.label.toLowerCase()}: enter a whole number from ${field.min} to ${field.max}.`
      }
    })
  })
  return errors
}

export function serializeWorkoutDraft(
  name: string,
  daysOfWeek: number[],
  items: WorkoutDraftItem[]
): CreateWorkoutInput {
  return {
    name: name.trim(),
    daysOfWeek: [...daysOfWeek].sort((a, b) => a - b),
    items: items.map((item) => ({
      exerciseCode: item.exerciseCode,
      target: Number(item.target),
      sets: Number(item.sets),
      restSeconds: Number(item.restSeconds)
    }))
  }
}

export function getWorkoutCatalogue(
  group: string,
  search: string,
  items: WorkoutDraftItem[]
): WorkoutCatalogueEntry[] {
  const query = search.trim().toLowerCase()
  return exercises
    .filter(
      (exercise) =>
        (!group || exercise.muscleGroup === group) && exercise.name.toLowerCase().includes(query)
    )
    .map((exercise) => ({
      ...exercise,
      muscleLabel: capitalize(exercise.muscleGroup),
      addedCount: items.filter((item) => item.exerciseCode === exercise.id).length
    }))
}

export function getWorkoutDraftRows(items: WorkoutDraftItem[]): WorkoutDraftRow[] {
  return items.map((item) => ({
    ...item,
    name: exercises.find(({ id }) => id === item.exerciseCode)?.name ?? item.exerciseCode,
    fields: getWorkoutItemFields(item)
  }))
}

export function getWorkoutListRows(workouts: Workout[]): WorkoutListRow[] {
  return workouts.map((workout) => ({
    id: workout.id,
    name: workout.name,
    daysLabel: workoutDays
      .filter((day) => workout.daysOfWeek.includes(day.value))
      .map((day) => day.label)
      .join(', '),
    items: workout.items.map((item, index) => ({
      positionLabel: String(index + 1).padStart(2, '0'),
      name: exercises.find(({ id }) => id === item.exerciseCode)?.name ?? item.exerciseCode,
      sets: item.sets,
      target: item.target,
      targetUnit: item.targetType === 'time' ? 'sec' : 'reps',
      restSeconds: item.restSeconds
    }))
  }))
}
