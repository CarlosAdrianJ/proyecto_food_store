export type Category = {
  id: number
  denominacion: string
  descripcion: string | null
  createdAt: string
  updatedAt: string
  version: number | null
}

export type CategoryCreate = {
  denominacion: string
  descripcion: string
}

export type CategoryEdit = {
  denominacion: string
  descripcion: string
}