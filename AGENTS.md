# AGENTS.md

## Repfit - Project Description

Offline Windows 10/11 (64-bit) desktop app. A webcam + Python pose engine counts reps and flags bad form in real time. Ships as one installer with nothing else to install.

## Stack

- Electron (electron-vite), React + TypeScript, Tailwind
- SQLite via `better-sqlite3` (regular dependency, never dev)
- Python engine, PyInstaller-built, bundled into the app by electron-builder
- Pin Electron and engine package versions. Don't upgrade.

## Process boundaries

- **Renderer (React):** UI only. No Node, files, DB or camera. Data only via `window.api`; no fetch, no backend. Hash routing (app loads from a file).
- **Preload (`src/preload/`):** the list of functions screens may call, plus their types. No logic.
- **Main (`src/main/`):** the only process that opens the DB. Starts, stops, logs and restarts the engine. Holds recommendation rules. Register IPC handlers before creating the window. Single-instance lock; the engine must never outlive the app.
- **Engine (`engine/`):** owns the camera, pose detection, rep counting, form checks. Streams preview frames and messages to main. Never touches the DB.
- IPC carries plain data only (no class instances or functions). Validate all IPC input in main.
- Dev and packaged paths differ. Load engine/model files relative to the build/resources folder, never a project path.

## Shared contracts

- `shared/` (`exercises.json`, `templates.json`, `events.md`) is read by both app and engine. It defines engine messages and commands. Change it only if both sides agree; ask the user first.
- `src/shared/types.ts` holds TS types for main/preload/renderer. It is not the top-level `shared/`.
- New exercise = new `engine/models/<id>/` folder + `shared/exercises.json` entry.

## Database

- Every schema change is a new numbered migration. Never edit an existing one. Migrations run on startup.
- Store codes and numbers, not display text. Times in UTC.
- Never store totals; calculate when reading.
- A session keeps its own copy of the workout's name and plan. Editing or deleting a saved workout must never change past results.
- Save each set and its reps in one transaction.
- Queries are plain functions in `src/main/db/`, one file per area.

## Privacy and security

- Everything stays on the machine. No network features.
- Never store or persist camera frames or keypoints. Only reps and form results are saved.
- Keep context isolation on and Node access off in the renderer. Never load remote websites.
- No Electron global shortcuts; handle keys inside the window.

## Product invariants

- Every rep counts. Bad-form reps are flagged, never discarded.
- Stop/Esc during a set opens a pause dialog; never end a workout silently.
- The workout loop (`src/renderer/src/workout/`) is the core of the product. Don't break or casually refactor it.

## Repo rules

- Never commit `node_modules/`, `dist/`, `out/`, `engine/build/`, `engine/dist/`, `engine/.venv/`, or any `*.db`/`*.db-wal`/`*.db-shm` except `dev/fixture.db`.
- `dev/` (recordings, fixture DB) is test data, never shipped. Use it instead of a live camera.
- Automated tests only for number-producing logic: workout state machine, summaries, Progress queries.

## Coding rules

- Read the relevant existing code and understand how it works before changing it.
- Use the simplest solution that fully meets the requirement. Make the smallest complete change; never leave a feature half-done to keep the diff small.
- Reuse existing components, utilities, types and patterns first. If an existing solution can be extended safely, extend it instead of replacing it.
- No new dependencies without a clear need. State the need.
- No unnecessary abstractions, layers, wrappers, services, factories, repositories or design patterns.
- Don't refactor, rename or reformat unrelated code.
- Don't change the architecture above without a clear technical reason. Ask first.
- Preserve existing behavior unless the task requires changing it.
- Prefer explicit, readable code over clever or generic code. Don't split files, functions or components just to be "clean."
- No premature optimization.
- If a requirement is ambiguous and the choice could significantly affect architecture, ask before making a major change.
- Don't add unrequested features, options or config flags.
- Don't guess at APIs, files or types. Check they exist. Don't leave stubs, placeholders or TODOs in place of working code.
- Match the surrounding code's style and naming.

## Component Architecture

When creating or modifying React pages, follow these rules:

### 1. Component Separation
- Do not implement an entire page in a single large component.
- Break pages into smaller, focused components based on their responsibilities.
- Each component should have a clear and specific purpose.
- Extract distinct UI sections into separate components.
- Keep page components focused on layout, composition, and coordinating child components.

### 2. Component Organization
- Place reusable UI components in `src/components/ui/`.
- Place feature-specific components in `src/components/features/<feature-name>/`.
- Place page components in `src/pages/`.
- Use PascalCase for React component names and follow the project's existing filename conventions.

### 3. Reusability
- Extract components when they are reused or represent a meaningful, independent UI section.
- Pass data and callbacks through typed props.
- Avoid duplicating UI logic across components.
- Do not create unnecessary components for trivial elements.

### 4. Logic Separation
- Keep complex business logic out of presentational components.
- Extract reusable stateful logic into custom hooks when appropriate.
- Place API calls and external service interactions in dedicated service modules.
- Keep components easy to read, test, and maintain.

### 5. Implementation Requirements
Before implementing a page:
1. Identify its major UI sections.
2. Determine which sections should become separate components.
3. Create the necessary component files.
4. Compose the components inside the page file.
5. Follow the existing project structure and naming conventions.

**Important:** Prioritize maintainability, readability, and separation of concerns. Avoid both monolithic components and unnecessary component fragmentation.

## Plan mode

- In plan mode, do not modify files, create files, delete files, install dependencies, or run commands that change the project.
- First inspect the relevant existing code, types, components, IPC handlers, database queries, and configuration needed to - understand the task.
- Base the plan on the current codebase, not assumptions. Verify that referenced files, functions, types, and APIs exist.
- Identify the simplest implementation that fits the existing architecture and patterns.
- Before proposing changes, trace the affected flow across renderer, preload, main, database, and engine when applicable.
- The plan should clearly state:
  - what needs to change
  - which files are likely affected
  - how the parts will communicate
  - important edge cases or risks
  - whether any existing behavior or invariants could be affected
- Prefer a small, complete plan over a broad redesign.
- Do not propose architecture changes, new dependencies, or abstractions unless they are necessary for the requirement.
- Do not make implementation changes until the user explicitly asks to proceed.
- When the task is unclear and the uncertainty could materially change the implementation, ask a focused question before finalizing the plan.
- After planning, wait for approval before executing the plan.
