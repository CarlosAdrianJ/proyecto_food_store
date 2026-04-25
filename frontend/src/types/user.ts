import type { Role } from './auth'

export type User = {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  direccion: string | null
  rol: Role
  createdAt: string
  updatedAt: string
  version: number | null
}

export type UserEdit = {
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  rol: Role
}