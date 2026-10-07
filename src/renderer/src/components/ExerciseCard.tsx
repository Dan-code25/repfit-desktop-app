import { ArrowRight, Dumbbell, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ExerciseCardProps {
  to: string
  name: string
  target: string
  image?: string
}

function ExerciseCard({ to, name, target, image }: ExerciseCardProps): React.JSX.Element {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-[border-color,background-color,box-shadow] duration-200 hover:border-accent/50 hover:bg-white/[0.045] hover:shadow-lg hover:shadow-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground motion-reduce:transition-none"
    >
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-br from-accent-surface via-sidebar to-sidebar">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-4 mix-blend-screen transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Dumbbell className="h-9 w-9 text-accent-foreground" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <span className="text-base font-semibold leading-snug text-text-primary">{name}</span>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/30 bg-accent-surface px-2.5 py-1 text-xs font-medium text-accent-foreground">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            {target}
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent-foreground motion-reduce:transition-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  )
}

export default ExerciseCard
