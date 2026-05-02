export type FormaPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'

export type OrderDetailCreate = {
  productoId: number
  cantidad: number
}

export type OrderCreatePayload = {
  usuarioId: number
  formaPago: FormaPago
  detalles: OrderDetailCreate[]
}