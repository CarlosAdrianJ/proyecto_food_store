import { useEffect, useState } from 'react'
import OrderCard from '../../components/orders/OrderCard'
import OrderDetailModal from '../../components/orders/OrderDetailModal'
import { getOrdersByUser } from '../../services/orderService'
import type { Order } from '../../types/order'
import { getAuthUser } from '../../utils/authStorage'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    void loadOrders()
  }, [])

  async function loadOrders() {
    const user = getAuthUser()

    if (!user) {
      setError('No se encontró la sesión del usuario.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await getOrdersByUser(user.id)
      setOrders(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar tus pedidos.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Mis pedidos</h1>
        <p className="mt-2 text-slate-500">
          Revisa el historial de tus compras y consulta el estado de cada pedido.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm">
          Cargando pedidos...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-slate-500">
            Todavía no tienes pedidos registrados.
          </p>
        </div>
      ) : (
        <section className="grid gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onOpenDetail={setSelectedOrder}
            />
          ))}
        </section>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </main>
  )
}