import type { Lancamento } from "../types/lancamento";
import { formatarData, formatarMoedaCentavos } from "../utils/formatacao";

type Props = { lancamentos: Lancamento[] };

export function ListaLancamentos({ lancamentos }: Props) {
  if (lancamentos.length === 0) return <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">Nenhum lançamento neste mês.</p>;
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><ul aria-label="Lançamentos do mês" className="divide-y divide-slate-100">
    {lancamentos.map((item) => <li key={item.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0"><p className="truncate font-semibold text-slate-900">{item.descricao}</p><p className="mt-1 text-sm text-slate-500">{item.categoria} · {formatarData(item.data)}</p></div>
      <p className={`font-bold tabular-nums ${item.tipo === "receita" ? "text-emerald-700" : "text-rose-700"}`}>{item.tipo === "receita" ? "+ " : "− "}{formatarMoedaCentavos(item.valorCentavos)}</p>
    </li>)}
  </ul></div>;
}
