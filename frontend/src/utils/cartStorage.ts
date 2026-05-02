import type { Product } from '../types/product'

export type CartItem = {
  productId: number
  denominacion: string
  precio: number
  imagenUrl: string | null
  cantidad: number
  stock: number
}

const CART_KEY = 'cart'
const CART_UPDATED_EVENT = 'cart-updated'

function emitCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT))
}

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.removeItem(CART_KEY)
    return []
  }
}

export function getCart(): CartItem[] {
  return parseCart(localStorage.getItem(CART_KEY))
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  emitCartUpdated()
}

export function subscribeCartUpdates(callback: () => void): () => void {
  const handler = () => callback()

  window.addEventListener(CART_UPDATED_EVENT, handler)
  window.addEventListener('storage', handler)

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

export function getCartItemsCount(): number {
  return getCart().reduce((acc, item) => acc + item.cantidad, 0)
}

export function getCartTotal(): number {
  return getCart().reduce((acc, item) => acc + item.precio * item.cantidad, 0)
}

export function isProductInCart(productId: number): boolean {
  return getCart().some((item) => item.productId === productId)
}

export function addProductToCart(product: Product, quantity = 1): void {
  const cantidad = Math.max(1, Math.floor(quantity))
  const currentCart = getCart()
  const existing = currentCart.find((item) => item.productId === product.id)

  if (existing) {
    existing.cantidad = Math.min(existing.cantidad + cantidad, product.stock)
    existing.stock = product.stock
  } else {
    currentCart.push({
      productId: product.id,
      denominacion: product.denominacion,
      precio: product.precio,
      imagenUrl: product.imagenUrl,
      cantidad: Math.min(cantidad, product.stock),
      stock: product.stock,
    })
  }

  saveCart(currentCart)
}

export function removeProductFromCart(productId: number): void {
  const updatedCart = getCart().filter((item) => item.productId !== productId)
  saveCart(updatedCart)
}

export function updateProductQuantity(productId: number, quantity: number): void {
  const updatedCart = getCart().map((item) => {
    if (item.productId !== productId) return item

    const normalizedQuantity = Math.max(1, Math.floor(quantity))
    return {
      ...item,
      cantidad: Math.min(normalizedQuantity, item.stock),
    }
  })

  saveCart(updatedCart)
}

export function increaseProductQuantity(productId: number): void {
  const updatedCart = getCart().map((item) => {
    if (item.productId !== productId) return item

    return {
      ...item,
      cantidad: Math.min(item.cantidad + 1, item.stock),
    }
  })

  saveCart(updatedCart)
}

export function decreaseProductQuantity(productId: number): void {
  const currentCart = getCart()
  const target = currentCart.find((item) => item.productId === productId)

  if (!target) return

  if (target.cantidad <= 1) {
    removeProductFromCart(productId)
    return
  }

  const updatedCart = currentCart.map((item) => {
    if (item.productId !== productId) return item

    return {
      ...item,
      cantidad: item.cantidad - 1,
    }
  })

  saveCart(updatedCart)
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY)
  emitCartUpdated()
}