import { Check, X } from 'lucide-react'

export default function WorkoutToast({
  message,
  onDismiss,
  onFocusChange
}: {
  message: string
  onDismiss: (restoreFocus: boolean) => void
  onFocusChange: (focused: boolean) => void
}): React.JSX.Element {
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 w-[calc(100vw-32px)] max-w-sm sm:right-6 sm:bottom-6">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-white/15 bg-sidebar px-4 py-3 text-sm text-text-primary shadow-xl shadow-black/40">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-surface text-accent-foreground">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
        <span role="status" aria-atomic="true" className="min-w-0 flex-1 break-words">
          {message}
        </span>
        <button
          type="button"
          onClick={(event) => onDismiss(event.detail === 0)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          aria-label="Dismiss notification"
          className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
