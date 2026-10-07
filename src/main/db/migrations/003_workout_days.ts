export default `
CREATE TABLE workout_days (
  workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  PRIMARY KEY (workout_id, day_of_week)
);

INSERT INTO workout_days (workout_id, day_of_week)
SELECT id, day_of_week FROM workouts;

ALTER TABLE workouts DROP COLUMN day_of_week;
`
