import { Dumbbell, Target } from 'lucide-react'

interface ExerciseCardProps {
  name: string
  target: string
  image?: string
}

function ExerciseCard({ name, target, image }: ExerciseCardProps): React.JSX.Element {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/20 cursor-pointer">
      <div className="flex aspect-[16/7] items-center justify-center overflow-hidden bg-white/5">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Dumbbell
            className="h-7 w-7 text-text-secondary transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <span className="text-sm font-semibold leading-tight">{name}</span>
        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-accent/30 bg-accent-surface px-2 py-0.5 text-xs text-text-secondary">
          <Target className="h-3 w-3 text-accent" aria-hidden="true" />
          {target}
        </span>
      </div>
    </div>
  )
}

export default ExerciseCard
