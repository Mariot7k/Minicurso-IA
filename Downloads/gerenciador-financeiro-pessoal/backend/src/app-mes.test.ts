import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { criarAplicacao } from "./app";
import { abrirBancoDados } from "./data/database";

const banco = abrirBancoDados(":memory:");
const app = criarAplicacao(banco);
afterAll(() => banco.close());

describe("consulta mensal", () => {
  it("aceita dezembro e respeita a virada de ano", async () => {
    const resposta = await request(app).get("/api/lancamentos?mes=2026-12");
    expect(resposta.status).toBe(200);
    expect(resposta.body).toMatchObject({ mes: "2026-12", lancamentos: [], saldoCentavos: 0 });
  });

  it("não mistura lançamentos de janeiro com dezembro", async () => {
    await request(app).post("/api/lancamentos").send({ tipo: "receita", descricao: "Janeiro", valor: "1,00", categoria: "Teste", data: "2027-01-01" });
    const dezembro = await request(app).get("/api/lancamentos?mes=2026-12");
    expect(dezembro.body.lancamentos).toHaveLength(0);
    expect(dezembro.body.receitasCentavos).toBe(0);
  });
});
