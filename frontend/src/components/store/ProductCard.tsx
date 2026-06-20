import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'

type ProductCardProps = {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const sinStock = product.stock <= 0

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 shadow-sm">
      <div className="flex h-44 shrink-0 items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100">
        {product.imagenUrl ? (
          <img
            src={product.imagenUrl}
            alt={product.denominacion}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-5xl">🍔</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-orange-600">
              {product.categoriaDenominacion}
            </p>
            <h3 className="break-words text-lg font-bold leading-snug text-slate-800">
              {product.denominacion}
            </h3>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            ${product.precio.toFixed(2)}
          </span>
        </div>

        <p className="line-clamp-2 min-h-10 text-sm text-slate-500">
          {product.descripcion || 'Sin descripción disponible.'}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              sinStock
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {sinStock ? 'Sin stock' : `Stock: ${product.stock}`}
          </span>
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          <Link
            to={`/store/product/${product.id}`}
            className="flex-1 rounded-xl border border-orange-300 px-4 py-2 text-center text-sm font-medium text-orange-700 hover:bg-orange-50"
          >
            Ver detalle
          </Link>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={sinStock}
            className="flex-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}