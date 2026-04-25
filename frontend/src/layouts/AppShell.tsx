import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import LogoutButton from '../components/auth/LogoutButton'
import { getAuthUser } from '../utils/authStorage'

type AppShellProps = {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const user = getAuthUser()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-slate-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white">Food Store</h1>
            {user && (
              <p className="text-sm text-slate-300">
                {user.nombre} {user.apellido} · {user.rol}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <NavLink
              to="/store"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`
              }
            >
              Store
            </NavLink>

            {user?.rol === 'ADMIN' && (
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`
                }
              >
                Admin categorías
              </NavLink>
            )}

            <LogoutButton />
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}