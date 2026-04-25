import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getAuthUser, getRedirectPathByRole } from '../../utils/authStorage'

type GuestRouteProps = {
  children: ReactNode
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const user = getAuthUser()

  if (user) {
    return <Navigate to={getRedirectPathByRole(user.rol)} replace />
  }

  return <>{children}</>
}