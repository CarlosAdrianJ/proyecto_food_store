import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import { saveAuthUser, getRedirectPathByRole } from '../../utils/authStorage'

type FormErrors = {
  email?: string
  password?: string
}

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const newErrors: FormErrors = {}

    if (!form.email.trim()) {
      newErrors.email = 'El email es obligatorio.'
    }

    if (!form.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) return

    try {
      setIsSubmitting(true)
      setServerError(null)

      const user = await login({
        email: form.email.trim(),
        password: form.password,
      })

      saveAuthUser(user)
      navigate(getRedirectPathByRole(user.rol), { replace: true })
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'No se pudo iniciar sesión.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Iniciar sesión</h1>
        <p className="mt-2 text-slate-500">
          Ingresa con tu cuenta para acceder a Food Store.
        </p>

        {serverError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500"
              placeholder="correo@ejemplo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-sky-700 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  )
}