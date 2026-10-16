export type TipoLancamento = "receita" | "despesa";

export type NovoLancamento = {
  tipo: TipoLancamento;
  descricao: string;
  valor: string;
  categoria: string;
  data: string;
};

export type Lancamento = Omit<NovoLancamento, "valor"> & {
  id: number;
  valorCentavos: number;
};

export type ResumoMensal = {
  mes: string;
  lancamentos: Lancamento[];
  receitasCentavos: number;
  despesasCentavos: number;
  saldoCentavos: number;
};
