import type { DatabaseSync } from "node:sqlite";
import type { Lancamento, NovoLancamento, ResumoMensal } from "../types/lancamento";

type LinhaLancamento = { id: number; tipo: "receita" | "despesa"; descricao: string; valor_centavos: number; categoria: string; data: string };
type LinhaResumo = { receitas_centavos: number; despesas_centavos: number };

function mapearLancamento(linha: LinhaLancamento): Lancamento {
  return { id: linha.id, tipo: linha.tipo, descricao: linha.descricao, valorCentavos: linha.valor_centavos, categoria: linha.categoria, data: linha.data };
}

function limitesDoMes(mes: string): [string, string] {
  const [ano, numeroMes] = mes.split("-").map(Number);
  const proximoAno = numeroMes === 12 ? ano + 1 : ano;
  const proximoMes = numeroMes === 12 ? 1 : numeroMes + 1;
  return [`${mes}-01`, `${proximoAno}-${String(proximoMes).padStart(2, "0")}-01`];
}

export function listarPorMes(banco: DatabaseSync, mes: string): Lancamento[] {
  const [inicio, fim] = limitesDoMes(mes);
  const linhas = banco.prepare("SELECT id, tipo, descricao, valor_centavos, categoria, data FROM lancamentos WHERE data >= ? AND data < ? ORDER BY data DESC, id DESC").all(inicio, fim) as unknown as LinhaLancamento[];
  return linhas.map(mapearLancamento);
}

export function obterResumo(banco: DatabaseSync, mes: string): Pick<ResumoMensal, "receitasCentavos" | "despesasCentavos" | "saldoCentavos"> {
  const [inicio, fim] = limitesDoMes(mes);
  const linha = banco.prepare("SELECT COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor_centavos ELSE 0 END), 0) AS receitas_centavos, COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor_centavos ELSE 0 END), 0) AS despesas_centavos FROM lancamentos WHERE data >= ? AND data < ?").get(inicio, fim) as unknown as LinhaResumo;
  return { receitasCentavos: linha.receitas_centavos, despesasCentavos: linha.despesas_centavos, saldoCentavos: linha.receitas_centavos - linha.despesas_centavos };
}

export function inserirLancamento(banco: DatabaseSync, dados: NovoLancamento, valorCentavos: number): Lancamento {
  const resultado = banco.prepare("INSERT INTO lancamentos (tipo, descricao, valor_centavos, categoria, data) VALUES (?, ?, ?, ?, ?)").run(dados.tipo, dados.descricao, valorCentavos, dados.categoria, dados.data);
  return { id: Number(resultado.lastInsertRowid), tipo: dados.tipo, descricao: dados.descricao, valorCentavos, categoria: dados.categoria, data: dados.data };
}
