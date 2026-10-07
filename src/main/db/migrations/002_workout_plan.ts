export default `
ALTER TABLE workouts ADD COLUMN day_of_week INTEGER NOT NULL DEFAULT 1
  CHECK (day_of_week BETWEEN 1 AND 7);
ALTER TABLE workout_items ADD COLUMN target_type TEXT NOT NULL DEFAULT 'reps'
  CHECK (target_type IN ('reps', 'time'));
ALTER TABLE workout_items ADD COLUMN rest_seconds INTEGER NOT NULL DEFAULT 60
  CHECK (rest_seconds BETWEEN 0 AND 300);

UPDATE workout_items SET target_type = 'time' WHERE exercise_code = 'plank';
`
