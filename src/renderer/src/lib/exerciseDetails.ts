export interface ExerciseDetailContent {
  cameraGuidance: string
  steps: string[]
  mistakes: string[]
}

export const exerciseDetailsById: Partial<Record<string, ExerciseDetailContent>> = {
  squat: {
    cameraGuidance: 'Camera view: face the camera with your full body in frame.',
    steps: [
      'Stand with feet shoulder-width apart, toes turned out slightly.',
      'Push your hips back and bend your knees, keeping your chest up.',
      'Lower until your thighs are parallel to the floor.',
      'Drive through your heels to stand back up fully.'
    ],
    mistakes: [
      'Stopping short of parallel.',
      'Knees caving inward on the way up.',
      'Heels lifting off the floor.'
    ]
  }
}
