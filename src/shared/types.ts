export type TargetType = 'reps' | 'time'

export interface WorkoutItemInput {
  exerciseCode: string
  target: number
  sets: number
  restSeconds: number
}

export interface WorkoutItem extends WorkoutItemInput {
  targetType: TargetType
}

export interface CreateWorkoutInput {
  name: string
  daysOfWeek: number[]
  items: WorkoutItemInput[]
}

export interface ResolvedWorkoutInput extends Omit<CreateWorkoutInput, 'items'> {
  items: WorkoutItem[]
}

export interface Workout extends ResolvedWorkoutInput {
  id: number
  createdAt: string
  updatedAt: string
}

export type ApiResult<T> = { success: true; data: T } | { success: false; error: string }

export interface RepfitApi {
  listWorkouts: () => Promise<ApiResult<Workout[]>>
  createWorkout: (input: CreateWorkoutInput) => Promise<ApiResult<Workout>>
  updateWorkout: (id: number, input: CreateWorkoutInput) => Promise<ApiResult<Workout>>
  deleteWorkout: (id: number) => Promise<ApiResult<null>>
}
