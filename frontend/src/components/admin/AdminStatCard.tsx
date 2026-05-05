type AdminStatCardProps = {
  title: string
  value: string
  subtitle?: string
}

export default function AdminStatCard({
  title,
  value,
  subtitle,
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
      {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
    </div>
  )
}