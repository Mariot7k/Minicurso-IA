import type { Lancamento, NovoLancamento, ResumoMensal } from "../types/lancamento";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
type ErroApi = { error: string };

function obterMensagemErro(corpo: unknown): string | null {
  if (typeof corpo !== "object" || corpo === null || !("error" in corpo)) return null;
  return typeof corpo.error === "string" ? corpo.error : null;
}

async function lerResposta<T>(resposta: Response, mensagemPadrao: string): Promise<T> {
  const corpo: unknown = await resposta.json();
  if (!resposta.ok) throw new Error(obterMensagemErro(corpo) ?? mensagemPadrao);
  return corpo as T;
}

export async function listarLancamentos(mes: string): Promise<ResumoMensal> {
  const resposta = await fetch(`${API_URL}/api/lancamentos?mes=${encodeURIComponent(mes)}`);
  return lerResposta<ResumoMensal>(resposta, "Não foi possível carregar os lançamentos.");
}

export async function criarLancamento(dados: NovoLancamento): Promise<Lancamento> {
  const resposta = await fetch(`${API_URL}/api/lancamentos`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados),
  });
  return lerResposta<Lancamento>(resposta, "Não foi possível salvar o lançamento.");
}
