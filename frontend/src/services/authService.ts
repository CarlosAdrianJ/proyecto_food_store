import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth'

const AUTH_BASE_URL = 'http://localhost:8080/api/auth'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Ocurrió un error inesperado'

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }

    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}

export async function login(payload: LoginRequest): Promise<AuthUser> {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<AuthUser>(response)
}

export async function register(payload: RegisterRequest): Promise<AuthUser> {
  const response = await fetch(`${AUTH_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<AuthUser>(response)
}