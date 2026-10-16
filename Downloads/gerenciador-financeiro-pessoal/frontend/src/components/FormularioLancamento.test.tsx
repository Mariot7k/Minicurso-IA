import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormularioLancamento } from "./FormularioLancamento";

describe("formulário de lançamento", () => {
  it("mostra erro genérico se o salvamento falhar com um valor não Error", async () => {
    const onSalvar = vi.fn(async () => { throw "falha"; });
    render(<FormularioLancamento onSalvar={onSalvar} />);
    fireEvent.change(screen.getByLabelText("Descrição"), { target: { value: "Compra" } });
    fireEvent.change(screen.getByLabelText("Valor (R$)"), { target: { value: "5,00" } });
    fireEvent.change(screen.getByLabelText("Categoria"), { target: { value: "Casa" } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar lançamento" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain("Não foi possível salvar o lançamento.");
  });
});
