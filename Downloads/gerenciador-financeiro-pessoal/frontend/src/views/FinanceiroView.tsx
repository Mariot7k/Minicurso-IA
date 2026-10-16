import { FormularioLancamento } from "../components/FormularioLancamento";
import { ListaLancamentos } from "../components/ListaLancamentos";
import { ResumoFinanceiro } from "../components/ResumoFinanceiro";
import { SeletorMes } from "../components/SeletorMes";
import { useFinanceiro } from "../hooks/useFinanceiro";

export function FinanceiroView() {
  const { mes, resumo, carregando, erro, mensagem, alterarMes, adicionar } = useFinanceiro();
  return <main className="mx-auto grid min-h-screen max-w-6xl gap-7 px-4 py-8 sm:px-6 lg:py-12">
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">Finanças pessoais</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Meu financeiro</h1><p className="mt-2 max-w-xl text-slate-600">Acompanhe suas receitas, despesas e o saldo de cada mês.</p></div><div className="w-full sm:max-w-xs"><SeletorMes mes={mes} onChange={alterarMes} /></div></header>
    <ResumoFinanceiro receitas={resumo.receitasCentavos} despesas={resumo.despesasCentavos} saldo={resumo.saldoCentavos} />
    {mensagem && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{mensagem}</p>}
    {erro && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{erro}</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.4fr)]"><FormularioLancamento onSalvar={adicionar} /><section className="grid gap-3"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-slate-900">Lançamentos</h2>{carregando && <span role="status" className="text-sm text-slate-500">Atualizando...</span>}</div>{carregando && resumo.lancamentos.length === 0 ? <p role="status" className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Carregando lançamentos...</p> : <ListaLancamentos lancamentos={resumo.lancamentos} />}</section></div>
    <footer className="border-t border-slate-200 pt-4 text-xs text-slate-500">Os valores são registrados em centavos para evitar erros de arredondamento. Seus dados ficam salvos no banco local da aplicação.</footer>
  </main>;
}
