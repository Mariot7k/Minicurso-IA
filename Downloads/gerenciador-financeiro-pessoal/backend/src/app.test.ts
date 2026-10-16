import request from "supertest";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { criarAplicacao } from "./app";
import { abrirBancoDados } from "./data/database";
import { logger } from "./logger";

const banco = abrirBancoDados(":memory:");
const app = criarAplicacao(banco);
const lancamentoValido = { tipo: "receita", descricao: "Salário", valor: "2500,00", categoria: "Trabalho", data: "2026-10-05" };

beforeEach(() => banco.exec("DELETE FROM lancamentos; DELETE FROM sqlite_sequence WHERE name = 'lancamentos';"));
afterAll(() => banco.close());

describe("API do gerenciador financeiro", () => {
  it("informa que a API está ativa", async () => {
    const resposta = await request(app).get("/health");
    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({ status: "ok" });
  });

  it("retorna resumo zerado para mês sem lançamentos", async () => {
    const resposta = await request(app).get("/api/lancamentos?mes=2026-10");
    expect(resposta.status).toBe(200);
    expect(resposta.body).toMatchObject({ receitasCentavos: 0, despesasCentavos: 0, saldoCentavos: 0, lancamentos: [] });
  });

  it("valida e persiste um lançamento, atualizando o saldo mensal", async () => {
    const criado = await request(app).post("/api/lancamentos").send(lancamentoValido);
    const consulta = await request(app).get("/api/lancamentos?mes=2026-10");
    expect(criado.status).toBe(201);
    expect(criado.body.valorCentavos).toBe(250000);
    expect(consulta.body.receitasCentavos).toBe(250000);
    expect(consulta.body.saldoCentavos).toBe(250000);
    expect(consulta.body.lancamentos[0].descricao).toBe("Salário");
  });

  it("calcula receitas, despesas e saldo apenas para o mês selecionado", async () => {
    await request(app).post("/api/lancamentos").send(lancamentoValido);
    await request(app).post("/api/lancamentos").send({ ...lancamentoValido, tipo: "despesa", descricao: "Conta de luz", valor: "89,99", data: "2026-10-10" });
    await request(app).post("/api/lancamentos").send({ ...lancamentoValido, descricao: "Outro mês", data: "2026-09-10" });
    const resposta = await request(app).get("/api/lancamentos?mes=2026-10");
    expect(resposta.body).toMatchObject({ receitasCentavos: 250000, despesasCentavos: 8999, saldoCentavos: 241001 });
    expect(resposta.body.lancamentos).toHaveLength(2);
  });

  it.each([
    [{ ...lancamentoValido, valor: "0" }, "O valor deve ser maior que zero e estar dentro do limite permitido."],
    [{ ...lancamentoValido, valor: "-1,00" }, "Informe um valor positivo com até duas casas decimais."],
    [{ ...lancamentoValido, tipo: "transferência" }, "Selecione receita ou despesa."],
    [{ ...lancamentoValido, categoria: " " }, "A categoria é obrigatória."],
    [{ ...lancamentoValido, categoria: 3 }, "A categoria é obrigatória."],
    [{ ...lancamentoValido, data: "10/10/2026" }, "Informe uma data válida."],
    [{ ...lancamentoValido, descricao: " " }, "A descrição é obrigatória."],
  ])("rejeita dados inválidos na API", async (dados, mensagem) => {
    const resposta = await request(app).post("/api/lancamentos").send(dados);
    expect(resposta.status).toBe(400);
    expect(resposta.body.error).toBe(mensagem);
  });

  it("rejeita um formato de data impossível", async () => {
    const resposta = await request(app).post("/api/lancamentos").send({ ...lancamentoValido, data: "2026-99-99" });
    expect(resposta.status).toBe(400);
    expect(resposta.body.error).toBe("Informe uma data válida.");
  });

  it("retorna erro de validação quando o mês não é informado", async () => {
    const resposta = await request(app).get("/api/lancamentos");
    expect(resposta.status).toBe(400);
  });

  it("rejeita JSON malformado", async () => {
    const resposta = await request(app).post("/api/lancamentos").set("Content-Type", "application/json").send("{invalido");
    expect(resposta.status).toBe(400);
    expect(resposta.body.error).toBe("Corpo JSON inválido.");
  });

  it("usa o adaptador de logging centralizado", () => {
    const saida = vi.spyOn(console, "log").mockImplementation(() => undefined);
    logger.info("Teste de log");
    expect(saida).toHaveBeenCalledWith("Teste de log");
    saida.mockRestore();
  });

  it("trata erros inesperados da camada de dados", async () => {
    const bancoFechado = abrirBancoDados(":memory:");
    const appComBancoFechado = criarAplicacao(bancoFechado);
    bancoFechado.close();
    const saida = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const resposta = await request(appComBancoFechado).get("/api/lancamentos?mes=2026-10");
    expect(resposta.status).toBe(500);
    expect(saida).toHaveBeenCalled();
    saida.mockRestore();
  });

  it("rejeita um mês inválido", async () => {
    const resposta = await request(app).get("/api/lancamentos?mes=2026-13");
    expect(resposta.status).toBe(400);
    expect(resposta.body.error).toContain("mês válido");
  });
});
