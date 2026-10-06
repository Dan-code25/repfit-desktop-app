import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { migrations } from './migrations'

let db: Database.Database | null = null

export function openDb(): Database.Database {
  const file = join(app.getPath('userData'), 'repfit.db')
  db = new Database(file)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  runMigrations(db)
  console.log(db)
  return db
}

export function getDb(): Database.Database {
  if (!db) throw new Error('Database not opened')
  return db
}

export function closeDb(): void {
  db?.close()
  db = null
}

function runMigrations(database: Database.Database): void {
  const current = database.pragma('user_version', { simple: true }) as number

  for (let i = current; i < migrations.length; i++) {
    database.transaction(() => {
      database.exec(migrations[i])
      database.pragma(`user_version = ${i + 1}`)
    })()
  }
}

export function isDbOpen(): boolean {
  return db !== null && db.open
}
