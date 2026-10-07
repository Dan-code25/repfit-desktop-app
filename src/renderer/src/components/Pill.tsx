interface PillProps {
  label: string
  active: boolean
  onClick: () => void
  size?: 'sm' | 'md'
}

function Pill({ label, active, onClick, size = 'md' }: PillProps): React.JSX.Element {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cursor-pointer rounded-full border font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground motion-reduce:transition-none ${size === 'sm' ? 'min-h-8 px-2.5 py-1 text-xs' : 'min-h-11 px-4 py-2 text-sm'} ${
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
