import type { Category, CategoryCreate, CategoryEdit } from '../types/category'

const BASE_URL = 'http://localhost:8080/api/categories'

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

export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch(BASE_URL)
  return handleResponse<Category[]>(response)
}

export async function getCategoryById(id: number): Promise<Category> {
  const response = await fetch(`${BASE_URL}/${id}`)
  return handleResponse<Category>(response)
}

export async function createCategory(payload: CategoryCreate): Promise<Category> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<Category>(response)
}

export async function updateCategory(id: number, payload: CategoryEdit): Promise<Category> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<Category>(response)
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })

  return handleResponse<void>(response)
}