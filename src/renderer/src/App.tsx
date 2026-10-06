import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import TrainPage from './pages/TrainPage'
import ExercisesPage from './pages/ExercisesPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import AppLayout from './components/AppLayout'
import ExerciseDetail from './pages/ExerciseDetail'

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/train" element={<TrainPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/:exerciseId" element={<ExerciseDetail />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/train" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
