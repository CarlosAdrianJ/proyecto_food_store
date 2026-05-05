import type { EstadoPedido } from '../../types/order'

type OrderStatusBadgeProps = {
  estado: EstadoPedido
}

export default function OrderStatusBadge({ estado }: OrderStatusBadgeProps) {
  const styles: Record<EstadoPedido, string> = {
    PENDIENTE: 'bg-yellow-100 text-yellow-700',
    CONFIRMADO: 'bg-blue-100 text-blue-700',
    EN_PREPARACION: 'bg-purple-100 text-purple-700',
    ENVIADO: 'bg-cyan-100 text-cyan-700',
    ENTREGADO: 'bg-green-100 text-green-700',
    TERMINADO: 'bg-emerald-100 text-emerald-700',
    CANCELADO: 'bg-red-100 text-red-700',
  }

  const labels: Record<EstadoPedido, string> = {
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    EN_PREPARACION: 'En preparación',
    ENVIADO: 'Enviado',
    ENTREGADO: 'Entregado',
    TERMINADO: 'Terminado',
    CANCELADO: 'Cancelado',
  }

  return (
    <span
      className={'inline-flex rounded-full px-3 py-1 text-xs font-semibold ' + styles[estado]}
    >
      {labels[estado]}
    </span>
  )
}