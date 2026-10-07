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
    <nav
      aria-label="Main navigation"
      className="sticky top-0 flex h-screen w-52 shrink-0 flex-col border-r border-white/5 bg-sidebar px-4 py-7 text-text-primary xl:w-56"
    >
      <img src={RepfitLogo} alt="RepFit" className="mb-10 h-auto w-32" />

      <span className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
        Navigation
      </span>

      <ul className="flex w-full flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to} className="last:mt-auto last:border-t last:border-white/10 last:pt-4">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex min-h-12 items-center gap-3 rounded-lg border-l-2 px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground motion-reduce:transition-none ${
                  isActive
                    ? 'border-accent bg-accent-surface text-accent-foreground'
                    : 'border-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary active:bg-white/10'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar
