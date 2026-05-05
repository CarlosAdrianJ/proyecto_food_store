import type { Order, OrderCreatePayload, OrderUpdatePayload } from '../types/order'

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

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function createOrder(payload: OrderCreatePayload): Promise<Order> {
  const response = await fetch(ORDERS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<Order>(response)
}

export async function getOrdersByUser(userId: number): Promise<Order[]> {
  const response = await fetch(`${ORDERS_BASE_URL}/user/${userId}`)
  return handleResponse<Order[]>(response)
}

export async function getOrderById(orderId: number): Promise<Order> {
  const response = await fetch(`${ORDERS_BASE_URL}/${orderId}`)
  return handleResponse<Order>(response)
}

export async function getAllOrders(): Promise<Order[]> {
  const response = await fetch(ORDERS_BASE_URL)
  return handleResponse<Order[]>(response)
}

export async function updateOrder(
  orderId: number,
  payload: OrderUpdatePayload
): Promise<Order> {
  const response = await fetch(`${ORDERS_BASE_URL}/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<Order>(response)
}