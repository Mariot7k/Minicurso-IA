import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { criarLancamento } from "./lancamentos-service";

const dados = { tipo: "despesa" as const, descricao: "Café", valor: "5,25", categoria: "Alimentação", data: "2026-10-15" };
const resposta = (corpo: unknown) => ({ ok: false, json: async () => corpo }) as Response;

beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
afterEach(() => vi.unstubAllGlobals());

describe("erros da API financeira", () => {
  it.each([
    ["resposta textual", "Não foi possível salvar o lançamento."],
    [null, "Não foi possível salvar o lançamento."],
    [{}, "Não foi possível salvar o lançamento."],
    [{ error: 42 }, "Não foi possível salvar o lançamento."],
    [{ error: "Valor inválido" }, "Valor inválido"],
  ])("converte respostas de erro em mensagens legíveis", async (corpo, esperado) => {
    vi.mocked(fetch).mockResolvedValue(resposta(corpo));
    await expect(criarLancamento(dados)).rejects.toThrow(esperado);
  });
});
