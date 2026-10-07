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
  size?: 'sm' | 'md'
}

function PillGroup({
  ariaLabel,
  options,
  value,
  onChange,
  size
}: PillGroupProps): React.JSX.Element {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map(({ value: option, label }) => (
        <Pill
          key={option}
          label={label}
          active={option === value}
          size={size}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  )
}

export default PillGroup
