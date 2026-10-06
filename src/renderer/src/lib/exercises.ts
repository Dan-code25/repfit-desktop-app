import exercises from '../../../../shared/exercises.json'
import type { Exercise } from '@renderer/types/exercise.types'

export const getExerciseById = (id: string): Exercise | undefined => {
  const exercise = exercises.find((e) => e.id === id)
  return exercise
}

const exerciseImages = import.meta.glob<string>(
  '../assets/exercises/*.{png,jpg,jpeg,webp,avif,svg}',
  {
    eager: true,
    import: 'default'
  }
)

export const imagesByExerciseId: Record<string, string> = Object.fromEntries(
  Object.entries(exerciseImages).map(([path, url]) => {
    const filename = path.slice(path.lastIndexOf('/') + 1)
    return [filename.slice(0, filename.lastIndexOf('.')), url]
  })
)
