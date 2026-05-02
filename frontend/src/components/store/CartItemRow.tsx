import type { CartItem } from '../../utils/cartStorage'

type CartItemRowProps = {
  item: CartItem
  onIncrease: (productId: number) => void
  onDecrease: (productId: number) => void
  onChangeQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export default function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onChangeQuantity,
  onRemove,
}: CartItemRowProps) {
  const subtotal = item.precio * item.cantidad
  const sinStock = item.stock <= 0

  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[100px_1fr_auto]">
      <div className="flex h-24 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
        {item.imagenUrl ? (
          <img
            src={item.imagenUrl}
            alt={item.denominacion}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl">🍔</span>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800">
          {item.denominacion}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Precio unitario: ${item.precio.toFixed(2)}
        </p>

        <p
          className={`mt-1 text-sm font-medium ${
            sinStock ? 'text-red-600' : 'text-slate-600'
          }`}
        >
          {sinStock ? 'Sin stock' : `Stock disponible: ${item.stock}`}
        </p>

        <div className="mt-4 flex w-fit items-center overflow-hidden rounded-xl border border-slate-300">
          <button
            type="button"
            onClick={() => onDecrease(item.productId)}
            className="px-4 py-2 text-lg font-bold text-slate-700 hover:bg-slate-50"
          >
            -
          </button>

          <input
            type="number"
            min={1}
            max={item.stock}
            value={item.cantidad}
            onChange={(e) =>
              onChangeQuantity(item.productId, Number(e.target.value))
            }
            className="w-20 border-x border-slate-300 px-3 py-2 text-center outline-none"
          />

          <button
            type="button"
            onClick={() => onIncrease(item.productId)}
            disabled={item.cantidad >= item.stock}
            className="px-4 py-2 text-lg font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
          Subtotal: ${subtotal.toFixed(2)}
        </span>

        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Quitar
        </button>
      </div>
    </div>
  )
}