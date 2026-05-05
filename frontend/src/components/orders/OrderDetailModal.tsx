import type { Order } from '../../types/order'
import OrderStatusBadge from './OrderStatusBadge'

type OrderDetailModalProps = {
  order: Order
  onClose: () => void
}

export default function OrderDetailModal({
  order,
  onClose,
}: OrderDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b px-6 py-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Pedido #{order.id}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Detalle del pedido
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Fecha</p>
              <p className="mt-1 font-semibold text-slate-800">
                {new Date(order.fechaPedido).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Estado</p>
              <div className="mt-2">
                <OrderStatusBadge estado={order.estado} />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Forma de pago</p>
              <p className="mt-1 font-semibold text-slate-800">
                {order.formaPago}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total</p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">Ítems del pedido</h3>

            <div className="mt-4 space-y-3">
              {order.detalles.map((detail) => (
                <div
                  key={detail.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {detail.productoDenominacion}
                    </p>
                    <p className="text-sm text-slate-500">
                      Cantidad: {detail.cantidad}
                    </p>
                    <p className="text-sm text-slate-500">
                      Precio unitario: ${detail.precioUnitario.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">Subtotal</p>
                    <p className="text-lg font-bold text-slate-800">
                      ${detail.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}