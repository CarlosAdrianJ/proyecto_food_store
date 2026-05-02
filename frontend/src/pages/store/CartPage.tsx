import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CartBadge from '../../components/store/CartBadge'
import CartItemRow from '../../components/store/CartItemRow'
import { createOrder } from '../../services/orderService'
import type { FormaPago, OrderCreatePayload } from '../../types/order'
import { getAuthUser } from '../../utils/authStorage'
import {
  clearCart,
  decreaseProductQuantity,
  getCart,
  getCartItemsCount,
  getCartTotal,
  increaseProductQuantity,
  removeProductFromCart,
  subscribeCartUpdates,
  updateProductQuantity,
} from '../../utils/cartStorage'

export default function CartPage() {
  const [items, setItems] = useState(getCart())
  const [cartCount, setCartCount] = useState(getCartItemsCount())
  const [paymentMethod, setPaymentMethod] = useState<FormaPago>('EFECTIVO')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeCartUpdates(() => {
      setItems(getCart())
      setCartCount(getCartItemsCount())
    })

    return unsubscribe
  }, [])

  const total = useMemo(() => getCartTotal(), [items])

  const hasInvalidStock = useMemo(() => {
    return items.some((item) => item.cantidad > item.stock || item.stock <= 0)
  }, [items])

  function handleIncrease(productId: number) {
    increaseProductQuantity(productId)
    setItems(getCart())
    setCartCount(getCartItemsCount())
    setSuccessMessage(null)
  }

  function handleDecrease(productId: number) {
    decreaseProductQuantity(productId)
    setItems(getCart())
    setCartCount(getCartItemsCount())
    setSuccessMessage(null)
  }

  function handleChangeQuantity(productId: number, quantity: number) {
    if (Number.isNaN(quantity)) return

    updateProductQuantity(productId, quantity)
    setItems(getCart())
    setCartCount(getCartItemsCount())
    setSuccessMessage(null)
  }

  function handleRemove(productId: number) {
    removeProductFromCart(productId)
    setItems(getCart())
    setCartCount(getCartItemsCount())
    setSuccessMessage(null)
  }

  function handleClearCart() {
    clearCart()
    setItems([])
    setCartCount(0)
    setSuccessMessage(null)
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()

    const authUser = getAuthUser()

    if (!authUser) {
      setError('Debes iniciar sesión para continuar con la compra.')
      return
    }

    if (items.length === 0) {
      setError('El carrito está vacío.')
      return
    }

    if (hasInvalidStock) {
      setError('Hay productos con stock inválido. Revisa el carrito antes de continuar.')
      return
    }

    const payload: OrderCreatePayload = {
      usuarioId: authUser.id,
      formaPago: paymentMethod,
      detalles: items.map((item) => ({
        productoId: item.productId,
        cantidad: item.cantidad,
      })),
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccessMessage(null)

      await createOrder(payload)

      clearCart()
      setItems([])
      setCartCount(0)
      setSuccessMessage('Pedido generado correctamente.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo generar el pedido.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/store"
            className="text-sm font-medium text-orange-600 hover:underline"
          >
            ← Seguir comprando
          </Link>

          <h1 className="mt-2 text-3xl font-bold text-slate-800">Tu carrito</h1>
          <p className="mt-1 text-slate-500">
            Revisa productos, cantidades y confirma tu pedido.
          </p>
        </div>

        <CartBadge count={cartCount} />
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {successMessage}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-slate-500">Tu carrito está vacío.</p>

          <Link
            to="/store"
            className="mt-4 inline-block rounded-xl bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onChangeQuantity={handleChangeQuantity}
                onRemove={handleRemove}
              />
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClearCart}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Vaciar carrito
              </button>
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">Resumen</h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Productos</span>
                <span>{cartCount}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Ítems distintos</span>
                <span>{items.length}</span>
              </div>

              <div className="flex items-center justify-between border-t pt-3 text-lg font-bold text-slate-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {hasInvalidStock && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Hay productos con stock insuficiente o inválido.
              </div>
            )}

            <form onSubmit={handleCheckout} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Forma de pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as FormaPago)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TARJETA">Tarjeta</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || hasInvalidStock || items.length === 0}
                className="w-full rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar compra'}
              </button>
            </form>

            <p className="mt-4 text-xs text-slate-500">
              El payload del pedido se prepara desde acá usando usuario, forma de pago y detalle de productos.
            </p>
          </aside>
        </div>
      )}
    </main>
  )
}