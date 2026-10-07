import { useState } from 'react'

import exercises from '../../../../shared/exercises.json'
import PillGroup, { type PillGroupOption } from '../components/PillGroup'
import ExerciseCard from '../components/ExerciseCard'
import { capitalize } from '../lib/capitalize'
import { imagesByExerciseId } from '../lib/exercises'

const muscleGroups = [...new Set(exercises.map(({ muscleGroup }) => muscleGroup))]

const groupOptions: PillGroupOption[] = [
  { value: '', label: 'All' },
  ...muscleGroups.map((group) => ({ value: group, label: capitalize(group) }))
]

function ExercisesPage(): React.JSX.Element {
  const [selectedGroup, setSelectedGroup] = useState('')

  const visibleExercises =
    selectedGroup === ''
      ? exercises
      : exercises.filter(({ muscleGroup }) => muscleGroup === selectedGroup)

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-2 pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-foreground">
          Movement library
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Exercises</h1>
        <p className="text-sm text-text-secondary">Browse exercises by muscle group.</p>
      </header>

      <section className="sticky top-0 z-10 -mx-6 border-b border-white/10 bg-background/95 px-6 py-4 backdrop-blur-sm">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold">Muscle group</h2>
          <span aria-live="polite" className="text-xs text-text-secondary">
            {visibleExercises.length} {visibleExercises.length === 1 ? 'exercise' : 'exercises'}
          </span>
        </div>
        <PillGroup
          ariaLabel="Filter by muscle group"
          options={groupOptions}
          value={selectedGroup}
          onChange={setSelectedGroup}
        />
      </section>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visibleExercises.map(({ id, name, muscleGroup }) => (
          <li key={id}>
            <ExerciseCard
              to={`/exercises/${id}`}
              name={name}
              target={capitalize(muscleGroup)}
              image={imagesByExerciseId[id]}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ExercisesPage
