import type { OrderCreatePayload } from '../types/order'

const ORDERS_BASE_URL = 'http://localhost:8080/api/orders'

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

export async function createOrder(payload: OrderCreatePayload): Promise<unknown> {
  const response = await fetch(ORDERS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<unknown>(response)
}