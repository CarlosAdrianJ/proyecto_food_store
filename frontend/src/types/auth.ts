export type Role = 'ADMIN' | 'USUARIO'

export type AuthUser = {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: Role
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  nombre: string
  apellido: string
  email: string
  password: string
  telefono: string
  direccion: string
}