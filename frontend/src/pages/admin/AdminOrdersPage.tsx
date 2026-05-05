import { useEffect, useMemo, useState } from 'react'
import AdminStatCard from '../../components/admin/AdminStatCard'
import AdminOrderDetailModal from '../../components/orders/AdminOrderDetailModal'
import OrderStatusBadge from '../../components/orders/OrderStatusBadge'
import { getAllOrders, updateOrder } from '../../services/orderService'
import type { EstadoPedido, Order, OrderUpdatePayload } from '../../types/order'

type FilterOption = 'TODOS' | EstadoPedido

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filter, setFilter] = useState<FilterOption>('TODOS')

  useEffect(() => {
    void loadOrders()
  }, [])

  async function loadOrders() {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllOrders()
      setOrders(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los pedidos.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveOrder(payload: OrderUpdatePayload) {
    if (!selectedOrder) return

    try {
      setIsSubmitting(true)
      setError(null)

      const updated = await updateOrder(selectedOrder.id, payload)

      setOrders((prev) =>
        prev.map((order) => (order.id === updated.id ? updated : order))
      )

      setSelectedOrder(updated)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el pedido.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredOrders = useMemo(() => {
    if (filter === 'TODOS') return orders
    return orders.filter((order) => order.estado === filter)
  }, [orders, filter])

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0)
    const pendingOrders = orders.filter((o) => o.estado === 'PENDIENTE').length
    const activeOrders = orders.filter((o) =>
      ['CONFIRMADO', 'EN_PREPARACION', 'ENVIADO'].includes(o.estado)
    ).length

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      activeOrders,
    }
  }, [orders])

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard de pedidos
          </h1>
          <p className="mt-1 text-slate-500">
            Supervisa el negocio, revisa pedidos y actualiza estados.
          </p>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            title="Pedidos totales"
            value={String(stats.totalOrders)}
            subtitle="Cantidad total registrada"
          />

          <AdminStatCard
            title="Ingresos"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            subtitle="Suma de todos los pedidos"
          />

          <AdminStatCard
            title="Pendientes"
            value={String(stats.pendingOrders)}
            subtitle="Esperando gestión"
          />

          <AdminStatCard
            title="Activos"
            value={String(stats.activeOrders)}
            subtitle="Confirmados, en preparación o enviados"
          />
        </section>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b px-6 py-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Gestión de pedidos
            </h2>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">
                Filtrar por estado
              </label>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterOption)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-orange-500"
              >
                <option value="TODOS">TODOS</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="CONFIRMADO">CONFIRMADO</option>
                <option value="EN_PREPARACION">EN_PREPARACION</option>
                <option value="ENVIADO">ENVIADO</option>
                <option value="ENTREGADO">ENTREGADO</option>
                <option value="TERMINADO">TERMINADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-slate-500">Cargando pedidos...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="px-6 py-8 text-slate-500">
              No hay pedidos para el filtro seleccionado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Pago
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="px-6 py-4 text-sm text-slate-700">
                        #{order.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-800">
                          {order.usuarioNombre}
                        </div>
                        <div className="text-sm text-slate-500">
                          {order.usuarioEmail}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(order.fechaPedido).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <OrderStatusBadge estado={order.estado} />
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {order.formaPago}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        ${order.total.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-xl border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
                        >
                          Ver / gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <AdminOrderDetailModal
          order={selectedOrder}
          isSubmitting={isSubmitting}
          onClose={() => {
            if (isSubmitting) return
            setSelectedOrder(null)
          }}
          onSave={handleSaveOrder}
        />
      )}
    </main>
  )
}