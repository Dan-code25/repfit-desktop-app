import { useState } from 'react'
import exercises from '../../../../shared/exercises.json'
import PillGroup, { type PillGroupOption } from '../components/PillGroup'
import ExerciseCard from '../components/ExerciseCard'
import { capitalize } from '../lib/capitalize'
import { imagesByExerciseId } from '../lib/exerciseImages'

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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Exercises</h1>

      <PillGroup
        ariaLabel="Filter by muscle group"
        options={groupOptions}
        value={selectedGroup}
        onChange={setSelectedGroup}
      />

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visibleExercises.map(({ id, name, muscleGroup }) => (
          <li key={id}>
            <ExerciseCard
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
