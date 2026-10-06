const exerciseImages = import.meta.glob<string>(
  '../assets/exercises/*.{png,jpg,jpeg,webp,avif,svg}',
  {
    eager: true,
    import: 'default'
  }
)

export const imagesByExerciseId: Record<string, string> = Object.fromEntries(
  Object.entries(exerciseImages).map(([path, url]) => {
    const filename = path.slice(path.lastIndexOf('/') + 1)
    return [filename.slice(0, filename.lastIndexOf('.')), url]
  })
)
