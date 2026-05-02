import { Link } from 'react-router-dom'

type CartBadgeProps = {
  count: number
}

export default function CartBadge({ count }: CartBadgeProps) {
  return (
    <Link
      to="/store/cart"
      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
    >
      <span>🛒 Carrito</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
        {count}
      </span>
    </Link>
  )
}