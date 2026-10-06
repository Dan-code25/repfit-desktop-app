import { Outlet } from 'react-router-dom'
import { Dumbbell, List, BarChart3, Settings } from 'lucide-react'
import Sidebar, { type NavItem } from './Sidebar'

const NAV_ITEMS: NavItem[] = [
  { to: '/train', label: 'Train', icon: Dumbbell },
  { to: '/exercises', label: 'Exercises', icon: List },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings }
]

function AppLayout(): React.JSX.Element {
  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <Sidebar navItems={NAV_ITEMS} />

      <main className="min-w-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
