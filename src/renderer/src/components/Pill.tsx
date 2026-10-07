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
      className={`min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground motion-reduce:transition-none ${
        active
          ? 'border-accent bg-accent text-white shadow-sm shadow-accent/20'
          : 'border-white/10 bg-sidebar text-text-secondary hover:border-white/25 hover:bg-white/5 hover:text-text-primary active:bg-white/10'
      }`}
    >
      {label}
    </button>
  )
}

export default Pill
