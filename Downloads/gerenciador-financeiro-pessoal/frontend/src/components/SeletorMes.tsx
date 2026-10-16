type Props = { mes: string; onChange: (mes: string) => void };

export function SeletorMes({ mes, onChange }: Props) {
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">
    Mês consultado
    <input aria-label="Mês consultado" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="month" value={mes} onChange={(evento) => onChange(evento.target.value)} />
  </label>;
}
