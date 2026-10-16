import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import type { Lancamento, ResumoMensal } from "./types/lancamento";
import { obterMesAtual } from "./utils/formatacao";

const mesAtual = obterMesAtual();
const lancamento: Lancamento = { id: 1, tipo: "receita", descricao: "Salário", valorCentavos: 250000, categoria: "Trabalho", data: `${mesAtual}-05` };
const despesa: Lancamento = { id: 2, tipo: "despesa", descricao: "Mercado", valorCentavos: 4599, categoria: "Alimentação", data: `${mesAtual}-06` };
const resumo: ResumoMensal = { mes: mesAtual, lancamentos: [lancamento, despesa], receitasCentavos: 250000, despesasCentavos: 4599, saldoCentavos: 245401 };
const resposta = (corpo: unknown, ok = true, status = 200) => ({ ok, status, json: async () => corpo }) as Response;

beforeEach(() => { vi.stubGlobal("fetch", vi.fn().mockResolvedValue(resposta(resumo))); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("gerenciador financeiro", () => {
  it("mostra o resumo mensal e os lançamentos da API", async () => {
    render(<App />);
    expect(await screen.findByText("Salário")).toBeTruthy();
    expect(screen.getByText("Mercado")).toBeTruthy();
    expect(screen.getByText(/−\sR\$\s45,99/)).toBeTruthy();
    expect(screen.getByText(/R\$\s2\.500,00/)).toBeTruthy();
    expect(screen.getByText(/R\$\s2\.454,01/)).toBeTruthy();
  });

  it("mostra lista vazia e saldos zerados para um mês sem lançamentos", async () => {
    vi.mocked(fetch).mockResolvedValue(resposta({ mes: "2020-01", lancamentos: [], receitasCentavos: 0, despesasCentavos: 0, saldoCentavos: 0 }));
    render(<App />);
    fireEvent.change(screen.getByLabelText("Mês consultado"), { target: { value: "2020-01" } });
    expect(await screen.findByText("Nenhum lançamento neste mês.")).toBeTruthy();
    expect(await screen.findAllByText(/R\$\s0,00/)).toHaveLength(3);
  });

  it("envia um lançamento e apresenta a confirmação", async () => {
    const criado = { ...lancamento, id: 2, descricao: "Freela", valorCentavos: 9900, tipo: "receita" };
    vi.mocked(fetch).mockResolvedValueOnce(resposta(resumo)).mockResolvedValueOnce(resposta(criado, true, 201)).mockResolvedValueOnce(resposta({ ...resumo, lancamentos: [criado, lancamento, despesa] }));
    render(<App />);
    await screen.findByText("Salário");
    fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "receita" } });
    fireEvent.change(screen.getByLabelText("Descrição"), { target: { value: "Freela" } });
    fireEvent.change(screen.getByLabelText("Valor (R$)"), { target: { value: "99,00" } });
    fireEvent.change(screen.getByLabelText("Categoria"), { target: { value: "Extra" } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar lançamento" }));
    expect(await screen.findByText("Lançamento salvo com sucesso.")).toBeTruthy();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
  });

  it("apresenta erro amigável quando a API não carrega", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("sem conexão"));
    render(<App />);
    expect((await screen.findByRole("alert")).textContent).toContain("Verifique se a API está disponível");
  });

  it("apresenta a validação da API ao tentar salvar um valor inválido", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(resposta({ ...resumo, lancamentos: [] })).mockResolvedValueOnce(resposta({ error: "O valor deve ser maior que zero." }, false, 400));
    render(<App />);
    await screen.findByText("Nenhum lançamento neste mês.");
    fireEvent.change(screen.getByLabelText("Descrição"), { target: { value: "Compra" } });
    fireEvent.change(screen.getByLabelText("Valor (R$)"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("Categoria"), { target: { value: "Casa" } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar lançamento" }));
    expect((await screen.findByRole("alert")).textContent).toContain("O valor deve ser maior que zero.");
  });

  it("usa uma mensagem padrão se a API não informar detalhes do erro", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(resposta({ ...resumo, lancamentos: [] })).mockResolvedValueOnce(resposta({ error: 123 }, false, 500));
    render(<App />);
    await screen.findByText("Nenhum lançamento neste mês.");
    fireEvent.change(screen.getByLabelText("Descrição"), { target: { value: "Compra" } });
    fireEvent.change(screen.getByLabelText("Valor (R$)"), { target: { value: "10,00" } });
    fireEvent.change(screen.getByLabelText("Categoria"), { target: { value: "Casa" } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar lançamento" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Não foi possível salvar o lançamento.");
  });


  it("confirma um lançamento informado para outro mês sem misturá-lo ao resumo atual", async () => {
    const criado = { ...lancamento, id: 9, descricao: "Despesa antiga", data: "2020-01-10" };
    vi.mocked(fetch).mockResolvedValueOnce(resposta({ ...resumo, lancamentos: [] })).mockResolvedValueOnce(resposta(criado, true, 201));
    render(<App />);
    await screen.findByText("Nenhum lançamento neste mês.");
    fireEvent.change(screen.getByLabelText("Descrição"), { target: { value: "Despesa antiga" } });
    fireEvent.change(screen.getByLabelText("Valor (R$)"), { target: { value: "10,00" } });
    fireEvent.change(screen.getByLabelText("Categoria"), { target: { value: "Casa" } });
    fireEvent.change(screen.getByLabelText("Data"), { target: { value: "2020-01-10" } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar lançamento" }));
    expect(await screen.findByText("Lançamento salvo com sucesso.")).toBeTruthy();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });

});
