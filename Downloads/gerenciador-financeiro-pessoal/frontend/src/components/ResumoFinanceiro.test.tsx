import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResumoFinanceiro } from "./ResumoFinanceiro";

describe("resumo financeiro", () => {
  it("mostra receitas, despesas e saldo negativo com os valores formatados", () => {
    render(<ResumoFinanceiro receitas={50000} despesas={60000} saldo={-10000} />);
    expect(screen.getByText("R$ 500,00")).toBeTruthy();
    expect(screen.getByText("R$ 600,00")).toBeTruthy();
    expect(screen.getByText("-R$ 100,00")).toBeTruthy();
  });
});
