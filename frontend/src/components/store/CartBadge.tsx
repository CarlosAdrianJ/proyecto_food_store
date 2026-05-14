import { Link } from 'react-router-dom'

type CartBadgeProps = {
  count: number
}

export default function CartBadge({ count }: CartBadgeProps) {
  return (
    <Link
      to="/store/cart"
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:from-orange-600 hover:to-red-600"
    >
      <span>🛒 Carrito</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-white px-2 py-0.5 text-xs font-bold text-orange-600">
        {count}
      </span>
    </Link>
  )
}