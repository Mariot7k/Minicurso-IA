import { describe, expect, it } from "vitest";
import { converterValorEmCentavos, validarNovoLancamento, validarMes } from "./lancamento-service";
import { ErroValidacao } from "./erro-validacao";

const entrada = { tipo: "despesa", descricao: " Mercado ", valor: "15,20", categoria: " Casa ", data: "2026-10-15" };

describe("validação de lançamentos", () => {
  it("converte dinheiro para centavos sem arredondar", () => {
    expect(converterValorEmCentavos("0,10")).toBe(10);
    expect(converterValorEmCentavos("15.20")).toBe(1520);
    expect(converterValorEmCentavos("1234567,89")).toBe(123456789);
  });

  it.each(["0", "0,00", "-4", "1,999", "R$ 10,00", "", "1.234,56", "999999999999999999"])("rejeita valor fora do formato permitido: %s", (valor) => {
    expect(() => converterValorEmCentavos(valor)).toThrow(ErroValidacao);
  });

  it("limpa os campos de texto após validar um lançamento", () => {
    const resultado = validarNovoLancamento(entrada);
    expect(resultado.dados).toMatchObject({ descricao: "Mercado", categoria: "Casa", data: "2026-10-15" });
    expect(resultado.valorCentavos).toBe(1520);
  });

  it("rejeita corpo que não seja objeto", () => {
    expect(() => validarNovoLancamento(null)).toThrow("Informe os dados do lançamento.");
  });

  it("exige mês no formato AAAA-MM", () => {
    expect(() => validarMes("2026-00")).toThrow("mês válido");
    expect(() => validarMes("2026-12")).not.toThrow();
  });

  it("rejeita uma data sem calendário válido", () => {
    expect(() => validarNovoLancamento({ ...entrada, data: "2026-99-99" })).toThrow("Informe uma data válida.");
  });

});
