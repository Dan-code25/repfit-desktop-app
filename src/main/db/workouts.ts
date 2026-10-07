import { getDb } from './index'
import type { ResolvedWorkoutInput, Workout, WorkoutItem } from '../../shared/types'

export function listWorkouts(): Workout[] {
  const db = getDb()
  const workouts = db
    .prepare(
      `SELECT id, name,
              created_at AS createdAt, updated_at AS updatedAt
       FROM workouts ORDER BY created_at DESC, id DESC`
    )
    .all() as Omit<Workout, 'items' | 'daysOfWeek'>[]
  const days = db.prepare(
    'SELECT day_of_week AS day FROM workout_days WHERE workout_id = ? ORDER BY day_of_week'
  )
  const items = db.prepare(
    `SELECT exercise_code AS exerciseCode, target_type AS targetType, target, sets,
            rest_seconds AS restSeconds
     FROM workout_items WHERE workout_id = ? ORDER BY position, id`
  )

  return workouts.map((workout) => ({
    ...workout,
    daysOfWeek: (days.all(workout.id) as { day: number }[]).map(({ day }) => day),
    items: items.all(workout.id) as WorkoutItem[]
  }))
}

export function createWorkout(input: ResolvedWorkoutInput): Workout {
  const db = getDb()
  return db.transaction(() => {
    const now = new Date().toISOString()
    const result = db
      .prepare(
        `INSERT INTO workouts (name, created_at, updated_at)
         VALUES (?, ?, ?)`
      )
      .run(input.name, now, now)
    const id = Number(result.lastInsertRowid)
    const insertDay = db.prepare('INSERT INTO workout_days (workout_id, day_of_week) VALUES (?, ?)')
    input.daysOfWeek.forEach((day) => insertDay.run(id, day))
    const insertItem = db.prepare(
      `INSERT INTO workout_items
       (workout_id, position, exercise_code, target_type, target, sets, rest_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )

    input.items.forEach((item, position) => {
      insertItem.run(
        id,
        position,
        item.exerciseCode,
        item.targetType,
        item.target,
        item.sets,
        item.restSeconds
      )
    })

    return { ...input, id, createdAt: now, updatedAt: now }
  })()
}

export function updateWorkout(id: number, input: ResolvedWorkoutInput): Workout | null {
  const db = getDb()
  return db.transaction(() => {
    const existing = db
      .prepare('SELECT created_at AS createdAt FROM workouts WHERE id = ?')
      .get(id) as { createdAt: string } | undefined
    if (!existing) return null
    const updatedAt = new Date().toISOString()
    db.prepare('UPDATE workouts SET name = ?, updated_at = ? WHERE id = ?').run(
      input.name,
      updatedAt,
      id
    )
    db.prepare('DELETE FROM workout_days WHERE workout_id = ?').run(id)
    db.prepare('DELETE FROM workout_items WHERE workout_id = ?').run(id)
    const insertDay = db.prepare('INSERT INTO workout_days (workout_id, day_of_week) VALUES (?, ?)')
    input.daysOfWeek.forEach((day) => insertDay.run(id, day))
    const insertItem = db.prepare(
      `INSERT INTO workout_items
       (workout_id, position, exercise_code, target_type, target, sets, rest_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    input.items.forEach((item, position) => {
      insertItem.run(
        id,
        position,
        item.exerciseCode,
        item.targetType,
        item.target,
        item.sets,
        item.restSeconds
      )
    })
    return { ...input, id, createdAt: existing.createdAt, updatedAt }
  })()
}

export function deleteWorkout(id: number): boolean {
  return getDb().prepare('DELETE FROM workouts WHERE id = ?').run(id).changes > 0
}
