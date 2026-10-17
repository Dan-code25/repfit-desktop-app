interface ExerciseInstructionsProps {
  steps?: string[]
}

export default function ExerciseInstructions({
  steps
}: ExerciseInstructionsProps): React.JSX.Element {
  return (
    <section aria-labelledby="exercise-steps-heading">
      <h2 id="exercise-steps-heading" className="mb-3 text-base font-semibold">
        How to do it
      </h2>
      {steps?.length ? (
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm leading-relaxed">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-xs font-medium text-text-secondary"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm leading-relaxed text-text-secondary">
          Instructions for this exercise are not available yet.
        </p>
      )}
    </section>
  )
}
