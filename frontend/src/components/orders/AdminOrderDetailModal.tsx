import { useEffect, useState } from 'react'
import type { EstadoPedido, FormaPago, Order, OrderUpdatePayload } from '../../types/order'
import OrderStatusBadge from './OrderStatusBadge'

type AdminOrderDetailModalProps = {
  order: Order
  isSubmitting: boolean
  onClose: () => void
  onSave: (payload: OrderUpdatePayload) => Promise<void>
}

export default function AdminOrderDetailModal({
  order,
  isSubmitting,
  onClose,
  onSave,
}: AdminOrderDetailModalProps) {
  const [estado, setEstado] = useState<EstadoPedido>(order.estado)
  const [formaPago, setFormaPago] = useState<FormaPago>(order.formaPago)

  useEffect(() => {
    setEstado(order.estado)
    setFormaPago(order.formaPago)
  }, [order])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSave({ estado, formaPago })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b px-6 py-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Pedido #{order.id}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Gestión del pedido
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            disabled={isSubmitting}
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Cliente</p>
              <p className="mt-1 font-semibold text-slate-800">
                {order.usuarioNombre}
              </p>
              <p className="text-sm text-slate-500">{order.usuarioEmail}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Fecha</p>
              <p className="mt-1 font-semibold text-slate-800">
                {new Date(order.fechaPedido).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Estado actual</p>
              <div className="mt-2">
                <OrderStatusBadge estado={order.estado} />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total</p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoPedido)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="CONFIRMADO">CONFIRMADO</option>
                <option value="EN_PREPARACION">EN_PREPARACION</option>
                <option value="ENVIADO">ENVIADO</option>
                <option value="ENTREGADO">ENTREGADO</option>
                <option value="TERMINADO">TERMINADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Forma de pago
              </label>
              <select
                value={formaPago}
                onChange={(e) => setFormaPago(e.target.value as FormaPago)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              >
                <option value="EFECTIVO">EFECTIVO</option>
                <option value="TARJETA">TARJETA</option>
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-orange-500 px-5 py-2.5 font-medium text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>

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