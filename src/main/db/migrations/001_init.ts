export default `
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE workouts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE workout_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id    INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  position      INTEGER NOT NULL,
  exercise_code TEXT NOT NULL,
  sets          INTEGER NOT NULL CHECK (sets > 0),
  target        INTEGER NOT NULL CHECK (target > 0)
);

CREATE INDEX idx_workout_items_workout ON workout_items(workout_id);
`
