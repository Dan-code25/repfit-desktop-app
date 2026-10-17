import { useState } from 'react'
import {
  createWorkoutDraftItem,
  getWorkoutItemFields,
  type WorkoutDraftItem
} from '@renderer/lib/workoutDraft'

type SessionSetupField = ReturnType<typeof getWorkoutItemFields>[number] & {
  value: string
  valid: boolean
  onChange: (value: string) => void
  onBlur: () => void
  onStep: (direction: -1 | 1) => void
}

interface ExerciseSessionSetupController {
  draft: WorkoutDraftItem | undefined
  fields: SessionSetupField[]
}

export function useExerciseSessionSetup(exerciseCode: string): ExerciseSessionSetupController {
  const [draft, setDraft] = useState(() => createWorkoutDraftItem(exerciseCode))

  const fields = draft
    ? getWorkoutItemFields(draft).map(({ key, label, min, max }) => {
        const value = draft[key]
        const valid =
          value.trim() !== '' &&
          Number.isInteger(Number(value)) &&
          Number(value) >= min &&
          Number(value) <= max

        function changeValue(next: string): void {
          setDraft((current) => current && { ...current, [key]: next })
        }

        return {
          key,
          label,
          min,
          max,
          value,
          valid,
          onChange: changeValue,
          onBlur: () => {
            if (!valid) {
              changeValue(String(Math.max(min, Math.min(max, Math.round(Number(value) || min)))))
            }
          },
          onStep: (direction: -1 | 1) => {
            changeValue(String(Math.max(min, Math.min(max, (Number(value) || min) + direction))))
          }
        }
      })
    : []

  return {
    draft,
    fields
  }
}
