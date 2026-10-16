import { formatarMoedaCentavos } from "../utils/formatacao";

type Props = { receitas: number; despesas: number; saldo: number };
type CartaoProps = { titulo: string; valor: number; tom: string };

function CartaoResumo({ titulo, valor, tom }: CartaoProps) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-slate-500">{titulo}</p>
    <p className={`mt-2 text-2xl font-bold tracking-tight ${tom}`}>{formatarMoedaCentavos(valor)}</p>
  </article>;
}

export function ResumoFinanceiro({ receitas, despesas, saldo }: Props) {
  return <section aria-label="Resumo financeiro" className="grid gap-3 sm:grid-cols-3">
    <CartaoResumo titulo="Receitas" valor={receitas} tom="text-emerald-700" />
    <CartaoResumo titulo="Despesas" valor={despesas} tom="text-rose-700" />
    <CartaoResumo titulo="Saldo do mês" valor={saldo} tom={saldo < 0 ? "text-rose-700" : "text-indigo-700"} />
  </section>;
}
