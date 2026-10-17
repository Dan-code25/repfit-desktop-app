import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import ExerciseFormChecker from '@renderer/components/features/exercises/ExerciseFormChecker'
import ExerciseInstructions from '@renderer/components/features/exercises/ExerciseInstructions'
import ExerciseMedia from '@renderer/components/features/exercises/ExerciseMedia'
import ExerciseMistakes from '@renderer/components/features/exercises/ExerciseMistakes'
import ExerciseSessionSetup from '@renderer/components/features/exercises/ExerciseSessionSetup'
import { capitalize } from '@renderer/lib/capitalize'
import { exerciseDetailsById } from '@renderer/lib/exerciseDetails'
import { getExerciseById, videosByExerciseId } from '@renderer/lib/exercises'

function ExerciseDetail(): React.JSX.Element {
  const navigate = useNavigate()
  const { exerciseId } = useParams<{ exerciseId: string }>()

  const exercise = getExerciseById(exerciseId ?? '')
  const content = exercise ? exerciseDetailsById[exercise.id] : undefined

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => navigate('/exercises')}
        className="inline-flex min-h-11 w-fit cursor-pointer items-center gap-1.5 rounded-md text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground motion-reduce:transition-none"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      {exercise ? (
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="page-header break-words">{exercise.name}</h1>
            <p className="text-sm text-text-secondary">{capitalize(exercise.muscleGroup)}</p>
          </header>

          <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-6">
              <ExerciseMedia
                name={exercise.name}
                videoSrc={videosByExerciseId[exercise.id]}
                cameraGuidance={content?.cameraGuidance}
              />
              <ExerciseInstructions steps={content?.steps} />
              <ExerciseMistakes mistakes={content?.mistakes} />
            </div>

            <aside aria-label="Session setup and form checking" className="min-w-0 space-y-4">
              <ExerciseSessionSetup key={exercise.id} exerciseCode={exercise.id} />
              <ExerciseFormChecker />
            </aside>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h1 className="page-header">Exercise not found</h1>
          <p className="text-sm text-text-secondary">
            Go back to the exercise library to choose an exercise.
          </p>
        </div>
      )}
    </div>
  )
}

export default ExerciseDetail
