export type Product = {
  id: number
  denominacion: string
  descripcion: string | null
  precio: number
  stock: number
  disponible: boolean
  imagenUrl: string | null
  categoriaId: number
  categoriaDenominacion: string
  createdAt: string
  updatedAt: string
  version: number | null
}

export type ProductCreate = {
  denominacion: string
  descripcion: string
  precio: number
  stock: number
  disponible: boolean
  imagenUrl: string
  categoriaId: number
}

export type ProductEdit = {
  denominacion: string
  descripcion: string
  precio: number
  stock: number
  disponible: boolean
  imagenUrl: string
  categoriaId: number
}