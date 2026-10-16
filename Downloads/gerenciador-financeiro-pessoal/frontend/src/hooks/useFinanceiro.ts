import { useCallback, useEffect, useState } from "react";
import { criarLancamento, listarLancamentos } from "../services/lancamentos-service";
import type { NovoLancamento, ResumoMensal } from "../types/lancamento";
import { obterMesAtual } from "../utils/formatacao";

function resumoVazio(mes: string): ResumoMensal {
  return { mes, lancamentos: [], receitasCentavos: 0, despesasCentavos: 0, saldoCentavos: 0 };
}

export function useFinanceiro() {
  const [mes, setMes] = useState(obterMesAtual);
  const [resumo, setResumo] = useState<ResumoMensal>(() => resumoVazio(obterMesAtual()));
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const carregar = useCallback(async () => {
    setCarregando(true);
    try { setResumo(await listarLancamentos(mes)); setErro(""); }
    catch { setErro("Não foi possível carregar os lançamentos. Verifique se a API está disponível."); }
    finally { setCarregando(false); }
  }, [mes]);
  useEffect(() => { void carregar(); }, [carregar]);
  const adicionar = useCallback(async (dados: NovoLancamento) => {
    const criado = await criarLancamento(dados);
    setMensagem("Lançamento salvo com sucesso.");
    if (criado.data.slice(0, 7) === mes) await carregar();
    return criado;
  }, [carregar, mes]);
  const alterarMes = (novoMes: string) => { setMes(novoMes); setMensagem(""); setErro(""); };
  return { mes, resumo, carregando, erro, mensagem, alterarMes, adicionar };
}
