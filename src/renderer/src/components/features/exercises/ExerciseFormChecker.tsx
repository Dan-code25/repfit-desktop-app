import { ScanLine } from 'lucide-react'

export default function ExerciseFormChecker(): React.JSX.Element {
  return (
    <section
      aria-labelledby="form-checker-heading"
      className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
    >
      <h2 id="form-checker-heading" className="text-base font-semibold">
        What the form checker watches
      </h2>
      <div className="mt-4 flex items-start gap-3">
        <ScanLine className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-text-secondary">
          Form checking is not available yet for this exercise.
        </p>
      </div>
      <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-text-secondary">
        Every rep counts. Form issues are flagged without discarding reps.
      </p>
    </section>
  )
}
