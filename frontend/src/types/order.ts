export type FormaPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'

export type EstadoPedido =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREPARACION'
  | 'ENVIADO'
  | 'ENTREGADO'
  | 'TERMINADO'
  | 'CANCELADO'

export type OrderDetailCreate = {
  productoId: number
  cantidad: number
}

export type OrderCreatePayload = {
  usuarioId: number
  formaPago: FormaPago
  detalles: OrderDetailCreate[]
}

export type OrderUpdatePayload = {
  estado: EstadoPedido
  formaPago: FormaPago
}

export type OrderDetail = {
  id: number
  productoId: number
  productoDenominacion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export type Order = {
  id: number
  usuarioId: number
  usuarioNombre: string
  usuarioEmail: string
  fechaPedido: string
  total: number
  estado: EstadoPedido
  formaPago: FormaPago
  detalles: OrderDetail[]
  createdAt: string
  updatedAt: string
  version: number | null
}