import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CartBadge from '../../components/store/CartBadge'
import { getCatalogProductById } from '../../services/productService'
import type { Product } from '../../types/product'
import {
  addProductToCart,
  getCartItemsCount,
  subscribeCartUpdates,
} from '../../utils/cartStorage'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(0)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setCartCount(getCartItemsCount())

    const unsubscribe = subscribeCartUpdates(() => {
      setCartCount(getCartItemsCount())
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    void loadProduct()
  }, [id])

  async function loadProduct() {
    try {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      if (!id) {
        setError('Producto inválido.')
        return
      }

      const data = await getCatalogProductById(Number(id))
      setProduct(data)
      setQuantity(data.stock > 0 ? 1 : 0)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar el detalle del producto.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleDecrease() {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  function handleIncrease() {
    if (!product) return
    setQuantity((prev) => Math.min(product.stock, prev + 1))
  }

  function handleChangeQuantity(value: string) {
    if (!product) return

    const parsed = Number(value)

    if (Number.isNaN(parsed)) {
      setQuantity(1)
      return
    }

    const clamped = Math.min(product.stock, Math.max(1, Math.floor(parsed)))
    setQuantity(clamped)
  }

  function handleAddToCart() {
    if (!product) return
    if (product.stock <= 0) return

    addProductToCart(product, quantity)
    setCartCount(getCartItemsCount())
    setSuccessMessage(`Se agregaron ${quantity} unidad(es) al carrito.`)
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm">
          Cargando detalle del producto...
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error || 'No se encontró el producto.'}
        </div>

        <Link
          to="/store"
          className="mt-4 inline-block rounded-xl bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
        >
          Volver al catálogo
        </Link>
      </main>
    )
  }

  const sinStock = product.stock <= 0

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/store"
            className="text-sm font-medium text-orange-600 hover:underline"
          >
            ← Volver al catálogo
          </Link>

          <h1 className="mt-2 text-3xl font-bold text-slate-800">
            Detalle del producto
          </h1>
        </div>

        <CartBadge count={cartCount} />
      </div>

      {successMessage && (
        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {successMessage}
        </div>
      )}

      <section className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-2xl bg-slate-100">
          {product.imagenUrl ? (
            <img
              src={product.imagenUrl}
              alt={product.denominacion}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex min-h-[420px] items-center justify-center text-8xl">
              🍔
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            {product.categoriaDenominacion}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {product.denominacion}
          </h2>

          <p className="mt-4 text-slate-600">
            {product.descripcion || 'Sin descripción disponible.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-2xl font-bold text-slate-800">
              ${product.precio.toFixed(2)}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                sinStock
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {sinStock ? 'Sin stock' : `Stock disponible: ${product.stock}`}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                product.disponible
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {product.disponible ? 'Disponible' : 'No disponible'}
            </span>
          </div>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Cantidad
            </label>

            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-300">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={sinStock}
                className="px-4 py-2 text-lg font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                -
              </button>

              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => handleChangeQuantity(e.target.value)}
                disabled={sinStock}
                className="w-20 border-x border-slate-300 px-3 py-2 text-center outline-none disabled:bg-slate-100"
              />

              <button
                type="button"
                onClick={handleIncrease}
                disabled={sinStock || quantity >= product.stock}
                className="px-4 py-2 text-lg font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={sinStock || !product.disponible}
            className="mt-8 w-full rounded-2xl bg-orange-500 px-6 py-3 text-base font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {sinStock || !product.disponible
              ? 'Producto no disponible'
              : 'Agregar al carrito'}
          </button>
        </div>
      </section>
    </main>
  )
}