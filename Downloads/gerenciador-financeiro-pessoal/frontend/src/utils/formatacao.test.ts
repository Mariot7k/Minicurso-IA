import { describe, expect, it } from "vitest";
import { formatarData, formatarMoedaCentavos, obterDataAtual, obterMesAtual } from "./formatacao";

describe("formatação financeira", () => {
  it("formata centavos em reais sem perder os centavos", () => {
    expect(formatarMoedaCentavos(123456)).toBe("R$ 1.234,56");
  });
  it("formata zero e valores negativos", () => {
    expect(formatarMoedaCentavos(0)).toBe("R$ 0,00");
    expect(formatarMoedaCentavos(-501)).toBe("-R$ 5,01");
  });
  it("formata a data com dia, mês e ano", () => {
    expect(formatarData("2026-03-08")).toMatch(/08\/03\/2026/);
  });
  it("obtém mês e data atuais em formato de API", () => {
    expect(obterMesAtual()).toMatch(/^\d{4}-\d{2}$/);
    expect(obterDataAtual()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
