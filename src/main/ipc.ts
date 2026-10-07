import { ipcMain } from 'electron'
import exercises from '../../shared/exercises.json'
import { createWorkout, deleteWorkout, listWorkouts, updateWorkout } from './db/workouts'
import type { ApiResult, ResolvedWorkoutInput, Workout, WorkoutItem } from '../shared/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
}

function validateWorkout(value: unknown): ApiResult<ResolvedWorkoutInput> {
  if (!isRecord(value)) return { success: false, error: 'Invalid workout input.' }
  if (typeof value.name !== 'string' || !value.name.trim() || value.name.trim().length > 50) {
    return { success: false, error: 'Enter a workout name between 1 and 50 characters.' }
  }
  if (
    !Array.isArray(value.daysOfWeek) ||
    value.daysOfWeek.length === 0 ||
    value.daysOfWeek.length > 7 ||
    !value.daysOfWeek.every((day) => isIntegerInRange(day, 1, 7)) ||
    new Set(value.daysOfWeek).size !== value.daysOfWeek.length
  ) {
    return {
      success: false,
      error: 'Choose at least one day. Days must be unique numbers from 1 to 7.'
    }
  }
  if (!Array.isArray(value.items) || value.items.length === 0) {
    return { success: false, error: 'Add at least one exercise.' }
  }

  const items: WorkoutItem[] = []
  for (const [index, item] of value.items.entries()) {
    const prefix = `Exercise ${index + 1}: `
    if (!isRecord(item) || typeof item.exerciseCode !== 'string') {
      return { success: false, error: `${prefix}choose an exercise from the catalogue.` }
    }
    const exercise = exercises.find((entry) => entry.id === item.exerciseCode)
    if (!exercise)
      return { success: false, error: `${prefix}choose an exercise from the catalogue.` }
    const targetType = exercise.tracking === 'time' ? 'time' : 'reps'
    if (!isIntegerInRange(item.sets, 1, 10)) {
      return { success: false, error: `${prefix}sets must be a whole number from 1 to 10.` }
    }
    const min = targetType === 'reps' ? 1 : 5
    const max = targetType === 'reps' ? 100 : 600
    if (!isIntegerInRange(item.target, min, max)) {
      return {
        success: false,
        error: `${prefix}target must be a whole number from ${min} to ${max} ${targetType === 'reps' ? 'reps' : 'seconds'}.`
      }
    }
    if (!isIntegerInRange(item.restSeconds, 0, 300)) {
      return {
        success: false,
        error: `${prefix}rest must be a whole number from 0 to 300 seconds.`
      }
    }
    items.push({
      exerciseCode: item.exerciseCode,
      targetType,
      target: item.target,
      sets: item.sets,
      restSeconds: item.restSeconds
    })
  }
  return {
    success: true,
    data: {
      name: value.name.trim(),
      daysOfWeek: [...value.daysOfWeek].sort((a, b) => a - b),
      items
    }
  }
}

export function registerIpcHandlers(): void {
  ipcMain.handle('workouts:list', (): ApiResult<Workout[]> => {
    try {
      return { success: true, data: listWorkouts() }
    } catch (error) {
      console.error('Could not load workouts:', error)
      return { success: false, error: 'Could not load workouts. Please try again.' }
    }
  })

  ipcMain.handle('workouts:create', (_event, input: unknown): ApiResult<Workout> => {
    const validated = validateWorkout(input)
    if (!validated.success) return validated
    try {
      return { success: true, data: createWorkout(validated.data) }
    } catch (error) {
      console.error('Could not save workout:', error)
      return {
        success: false,
        error: 'Could not save workout. Your changes are still here. Try again.'
      }
    }
  })

  ipcMain.handle('workouts:update', (_event, id: unknown, input: unknown): ApiResult<Workout> => {
    if (!isIntegerInRange(id, 1, Number.MAX_SAFE_INTEGER)) {
      return { success: false, error: 'Invalid workout ID.' }
    }
    const validated = validateWorkout(input)
    if (!validated.success) return validated
    try {
      const workout = updateWorkout(id, validated.data)
      return workout
        ? { success: true, data: workout }
        : { success: false, error: 'Workout no longer exists.' }
    } catch (error) {
      console.error('Could not update workout:', error)
      return { success: false, error: 'Could not update workout. Please try again.' }
    }
  })

  ipcMain.handle('workouts:delete', (_event, id: unknown): ApiResult<null> => {
    if (!isIntegerInRange(id, 1, Number.MAX_SAFE_INTEGER)) {
      return { success: false, error: 'Invalid workout ID.' }
    }
    try {
      return deleteWorkout(id)
        ? { success: true, data: null }
        : { success: false, error: 'Workout no longer exists.' }
    } catch (error) {
      console.error('Could not delete workout:', error)
      return { success: false, error: 'Could not delete workout. Please try again.' }
    }
  })
}
