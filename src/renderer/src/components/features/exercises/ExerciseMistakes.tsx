interface ExerciseMistakesProps {
  mistakes?: string[]
}

export default function ExerciseMistakes({ mistakes }: ExerciseMistakesProps): React.JSX.Element {
  return (
    <section aria-labelledby="exercise-mistakes-heading">
      <h2 id="exercise-mistakes-heading" className="mb-3 text-base font-semibold">
        Common mistakes
      </h2>
      {mistakes?.length ? (
        <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed marker:text-amber-300">
          {mistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed text-text-secondary">
          Common mistakes for this exercise are not available yet.
        </p>
      )}
    </section>
  )
}
