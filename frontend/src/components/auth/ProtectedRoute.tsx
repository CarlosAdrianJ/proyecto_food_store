import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getAuthUser, getRedirectPathByRole } from '../../utils/authStorage'
import type { Role } from '../../types/auth'

type ProtectedRouteProps = {
  children: ReactNode
  allowedRoles?: Role[]
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const user = getAuthUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to={getRedirectPathByRole(user.rol)} replace />
  }

  return <>{children}</>
}