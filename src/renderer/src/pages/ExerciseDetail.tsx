import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { getExerciseById } from '@renderer/lib/exercises'

function ExerciseDetail(): React.JSX.Element {
  const navigate = useNavigate()
  const { exerciseId } = useParams<{ exerciseId: string }>()

  const exercise = getExerciseById(exerciseId ?? '')

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => navigate('/exercises')}
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Exercises
      </button>

      <div>{exercise?.name}</div>
    </div>
  )
}

export default ExerciseDetail
