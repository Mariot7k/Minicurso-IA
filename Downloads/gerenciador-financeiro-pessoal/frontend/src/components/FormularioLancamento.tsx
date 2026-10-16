import { useState, type FormEvent } from "react";
import type { NovoLancamento, TipoLancamento } from "../types/lancamento";
import { obterDataAtual } from "../utils/formatacao";
type Props = { onSalvar: (dados: NovoLancamento) => Promise<unknown> };

export function FormularioLancamento({ onSalvar }: Props) {
  const [tipo, setTipo] = useState<TipoLancamento>("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState(obterDataAtual);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const enviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault(); setErro(""); setSalvando(true);
    try { await onSalvar({ tipo, descricao, valor, categoria, data }); setDescricao(""); setValor(""); setCategoria(""); }
    catch (falha: unknown) { setErro(falha instanceof Error ? falha.message : "Não foi possível salvar o lançamento."); }
    finally { setSalvando(false); }
  };
  return <form aria-label="Formulário de lançamento" onSubmit={enviar} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-bold text-slate-900">Novo lançamento</h2>
    <label className="grid gap-1.5 text-sm font-medium">Tipo<select aria-label="Tipo" className="field" value={tipo} onChange={(evento) => setTipo(evento.target.value as TipoLancamento)}><option value="despesa">Despesa</option><option value="receita">Receita</option></select></label>
    <label className="grid gap-1.5 text-sm font-medium">Descrição<input className="field" value={descricao} onChange={(evento) => setDescricao(evento.target.value)} required maxLength={120} placeholder="Ex.: mercado" /></label>
    <div className="grid grid-cols-2 gap-3"><label className="grid gap-1.5 text-sm font-medium">Valor (R$)<input className="field" value={valor} onChange={(evento) => setValor(evento.target.value)} required inputMode="decimal" placeholder="0,00" /></label>
    <label className="grid gap-1.5 text-sm font-medium">Data<input className="field" type="date" value={data} onChange={(evento) => setData(evento.target.value)} required /></label></div>
    <label className="grid gap-1.5 text-sm font-medium">Categoria<input className="field" value={categoria} onChange={(evento) => setCategoria(evento.target.value)} required maxLength={60} placeholder="Ex.: alimentação" /></label>
    {erro && <p role="alert" className="text-sm font-medium text-rose-700">{erro}</p>}
    <button className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" disabled={salvando}>{salvando ? "Salvando..." : "Adicionar lançamento"}</button>
  </form>;
}
