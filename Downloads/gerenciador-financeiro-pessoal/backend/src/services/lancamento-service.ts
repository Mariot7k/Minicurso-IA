import type { DatabaseSync } from "node:sqlite";
import { inserirLancamento, listarPorMes, obterResumo } from "../data/lancamento-repository";
import { ErroValidacao } from "./erro-validacao";
import type { Lancamento, NovoLancamento, ResumoMensal, TipoLancamento } from "../types/lancamento";

const PADRAO_MES = /^\d{4}-(0[1-9]|1[0-2])$/;
const PADRAO_DATA = /^\d{4}-\d{2}-\d{2}$/;
const PADRAO_VALOR = /^\d+(?:[.,]\d{1,2})?$/;

export function validarMes(mes: string): void {
  if (!PADRAO_MES.test(mes)) throw new ErroValidacao("Informe um mês válido no formato AAAA-MM.");
}

export function converterValorEmCentavos(valor: string): number {
  const texto = valor.trim();
  if (!PADRAO_VALOR.test(texto)) throw new ErroValidacao("Informe um valor positivo com até duas casas decimais.");
  const [inteiro, fracao = ""] = texto.replace(",", ".").split(".");
  const centavos = Number(inteiro) * 100 + Number(fracao.padEnd(2, "0"));
  if (!Number.isSafeInteger(centavos) || centavos <= 0) throw new ErroValidacao("O valor deve ser maior que zero e estar dentro do limite permitido.");
  return centavos;
}

function validarData(data: string): boolean {
  if (!PADRAO_DATA.test(data)) return false;
  const dataValidada = new Date(`${data}T00:00:00.000Z`);
  return !Number.isNaN(dataValidada.getTime()) && dataValidada.toISOString().slice(0, 10) === data;
}

function lerCampoTexto(campo: unknown): string {
  return typeof campo === "string" ? campo.trim() : "";
}

export function validarNovoLancamento(entrada: unknown): { dados: NovoLancamento; valorCentavos: number } {
  if (typeof entrada !== "object" || entrada === null) throw new ErroValidacao("Informe os dados do lançamento.");
  const corpo = entrada as Record<string, unknown>;
  const tipo = corpo.tipo;
  const descricao = lerCampoTexto(corpo.descricao);
  const valor = lerCampoTexto(corpo.valor);
  const categoria = lerCampoTexto(corpo.categoria);
  const data = lerCampoTexto(corpo.data);
  if (tipo !== "receita" && tipo !== "despesa") throw new ErroValidacao("Selecione receita ou despesa.");
  if (!descricao) throw new ErroValidacao("A descrição é obrigatória.");
  if (!categoria) throw new ErroValidacao("A categoria é obrigatória.");
  if (!validarData(data)) throw new ErroValidacao("Informe uma data válida.");
  return { dados: { tipo: tipo as TipoLancamento, descricao, valor, categoria, data }, valorCentavos: converterValorEmCentavos(valor) };
}

export function listarResumoMensal(banco: DatabaseSync, mes: string): ResumoMensal {
  validarMes(mes);
  return { mes, lancamentos: listarPorMes(banco, mes), ...obterResumo(banco, mes) };
}

export function cadastrarLancamento(banco: DatabaseSync, entrada: unknown): Lancamento {
  const { dados, valorCentavos } = validarNovoLancamento(entrada);
  return inserirLancamento(banco, dados, valorCentavos);
}
