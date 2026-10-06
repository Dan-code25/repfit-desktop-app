interface PillProps {
  label: string
  active: boolean
  onClick: () => void
}

function Pill({ label, active, onClick }: PillProps): React.JSX.Element {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        active
          ? 'border-accent bg-accent-surface text-text-primary'
          : 'border-white/10 text-text-secondary hover:border-white/20 hover:bg-white/5 hover:text-text-primary'
      }`}
    >
      {label}
    </button>
  )
}

export default Pill
