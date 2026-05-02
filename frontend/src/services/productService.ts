import type { Product, ProductCreate, ProductEdit } from '../types/product'

const PRODUCTS_BASE_URL = 'http://localhost:8080/api/products'

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

export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_BASE_URL)
  return handleResponse<Product[]>(response)
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${PRODUCTS_BASE_URL}/${id}`)
  return handleResponse<Product>(response)
}

export async function createProduct(payload: ProductCreate): Promise<Product> {
  const response = await fetch(PRODUCTS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<Product>(response)
}

export async function updateProduct(id: number, payload: ProductEdit): Promise<Product> {
  const response = await fetch(`${PRODUCTS_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<Product>(response)
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${PRODUCTS_BASE_URL}/${id}`, {
    method: 'DELETE',
  })

  return handleResponse<void>(response)
}
export async function getCatalogProducts(): Promise<Product[]> {
  const response = await fetch(`${PRODUCTS_BASE_URL}/catalog`)
  return handleResponse<Product[]>(response)
}

export async function getCatalogProductById(id: number): Promise<Product> {
  const response = await fetch(`${PRODUCTS_BASE_URL}/catalog/${id}`)
  return handleResponse<Product>(response)
}

export async function getCatalogProductsByCategory(categoryId: number): Promise<Product[]> {
  const response = await fetch(`${PRODUCTS_BASE_URL}/catalog/category/${categoryId}`)
  return handleResponse<Product[]>(response)
}