import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import RepfitLogo from '../assets/images/Repfit.svg'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

function Sidebar({ navItems }: { navItems: NavItem[] }): React.JSX.Element {
  return (
    <nav className="sticky top-0 flex h-screen w-20 shrink-0 flex-col items-center bg-sidebar px-2 py-6 text-text-primary">
      <img src={RepfitLogo} alt="RepFit" className="w-full pb-6" />

      <ul className="flex w-full flex-col gap-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-center text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-surface text-accent'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                }`
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar
