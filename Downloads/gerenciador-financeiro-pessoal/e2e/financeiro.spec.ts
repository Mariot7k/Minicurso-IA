import { expect, test } from "@playwright/test";

test("cadastra um lançamento e mostra sua descrição e valor", async ({ page }) => {
  await page.goto("/");
  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  const descricao = `Compra E2E ${Date.now()}`;
  await page.getByLabel("Descrição").fill(descricao);
  await page.getByLabel("Valor (R$)").fill("17,49");
  await page.getByLabel("Categoria").fill("Teste");
  await page.getByRole("button", { name: "Adicionar lançamento" }).click();
  await expect(page.getByText("Lançamento salvo com sucesso.")).toBeVisible();
  await page.getByLabel("Mês consultado").fill(mesAtual);
  await expect(page.getByText(descricao)).toBeVisible();
  await expect(page.getByText(/−\sR\$\s17,49/)).toBeVisible();
});
