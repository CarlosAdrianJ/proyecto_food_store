import type { User, UserEdit } from '../types/user'

const USERS_BASE_URL = 'http://localhost:8080/api/users'

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

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(USERS_BASE_URL)
  return handleResponse<User[]>(response)
}

export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`${USERS_BASE_URL}/${id}`)
  return handleResponse<User>(response)
}

export async function updateUser(id: number, payload: UserEdit): Promise<User> {
  const response = await fetch(`${USERS_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<User>(response)
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${USERS_BASE_URL}/${id}`, {
    method: 'DELETE',
  })

  return handleResponse<void>(response)
}