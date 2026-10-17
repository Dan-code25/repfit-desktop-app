import { Play } from 'lucide-react'
import NumberStepper from '@renderer/components/ui/NumberStepper'
import { useExerciseSessionSetup } from '@renderer/hooks/useExerciseSessionSetup'

interface ExerciseSessionSetupProps {
  exerciseCode: string
}

export default function ExerciseSessionSetup({
  exerciseCode
}: ExerciseSessionSetupProps): React.JSX.Element {
  const { draft, fields } = useExerciseSessionSetup(exerciseCode)

  if (!draft) {
    return <p className="text-sm text-text-secondary">Session setup is unavailable.</p>
  }

  return (
    <section
      aria-labelledby="session-setup-heading"
      className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
    >
      <h2 id="session-setup-heading" className="mb-5 text-base font-semibold">
        Set up your session
      </h2>

      <div className="space-y-3">
        {fields.map(({ key, ...field }) => (
          <NumberStepper key={key} id={`session-${key}`} {...field} />
        ))}
      </div>

      <button
        type="button"
        disabled
        aria-describedby="session-unavailable"
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Play className="h-4 w-4" aria-hidden="true" />
        Start
      </button>
      <p id="session-unavailable" className="mt-3 text-xs leading-relaxed text-text-secondary">
        Session tracking is not available yet.
      </p>
    </section>
  )
}
