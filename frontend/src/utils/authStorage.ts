import type { AuthUser, Role } from '../types/auth'

const AUTH_USER_KEY = 'authUser'

export function saveAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_USER_KEY)

  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_USER_KEY)
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null
}

export function isAdmin(): boolean {
  return getAuthUser()?.rol === 'ADMIN'
}

export function getRedirectPathByRole(rol: Role): string {
  return rol === 'ADMIN' ? '/admin/categories' : '/store'
}