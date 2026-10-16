export type TipoLancamento = "receita" | "despesa";

export type NovoLancamento = {
  tipo: TipoLancamento;
  descricao: string;
  valor: string;
  categoria: string;
  data: string;
};

export type Lancamento = {
  id: number;
  tipo: TipoLancamento;
  descricao: string;
  valorCentavos: number;
  categoria: string;
  data: string;
};

export type ResumoMensal = {
  mes: string;
  lancamentos: Lancamento[];
  receitasCentavos: number;
  despesasCentavos: number;
  saldoCentavos: number;
};
