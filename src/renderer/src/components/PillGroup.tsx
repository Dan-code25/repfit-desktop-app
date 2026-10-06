import Pill from './Pill'

export interface PillGroupOption {
  value: string
  label: string
}

interface PillGroupProps {
  ariaLabel: string
  options: PillGroupOption[]
  value: string
  onChange: (value: string) => void
}

function PillGroup({ ariaLabel, options, value, onChange }: PillGroupProps): React.JSX.Element {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="sticky top-0 z-10 flex flex-wrap gap-2 bg-background py-2"
    >
      {options.map(({ value: option, label }) => (
        <Pill
          key={option}
          label={label}
          active={option === value}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  )
}

export default PillGroup
