import type { Order } from '../../types/order'
import OrderStatusBadge from './OrderStatusBadge'

type OrderCardProps = {
  order: Order
  onOpenDetail: (order: Order) => void
}

export default function OrderCard({ order, onOpenDetail }: OrderCardProps) {
  const itemsCount = order.detalles.reduce((acc, detail) => acc + detail.cantidad, 0)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Pedido #{order.id}
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-800">
            {new Date(order.fechaPedido).toLocaleString()}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {itemsCount} producto(s) · Pago: {order.formaPago}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <OrderStatusBadge estado={order.estado} />

          <span className="text-xl font-bold text-slate-800">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {order.detalles.slice(0, 3).map((detail) => (
          <div
            key={detail.id}
            className="flex items-center justify-between text-sm text-slate-600"
          >
            <span>
              {detail.cantidad} x {detail.productoDenominacion}
            </span>
            <span>${detail.subtotal.toFixed(2)}</span>
          </div>
        ))}

        {order.detalles.length > 3 && (
          <p className="text-sm text-slate-400">
            + {order.detalles.length - 3} ítem(s) más
          </p>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => onOpenDetail(order)}
          className="rounded-xl border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
        >
          Ver detalle
        </button>
      </div>
    </article>
  )
}