import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { abrirBancoDados } from "./database";
import { inserirLancamento, listarPorMes } from "./lancamento-repository";

const pastasTemporarias: string[] = [];
afterEach(() => pastasTemporarias.splice(0).forEach((pasta) => rmSync(pasta, { recursive: true, force: true })));

describe("persistência em SQLite", () => {
  it("mantém os lançamentos após fechar e reabrir a conexão", () => {
    const pasta = mkdtempSync(join(tmpdir(), "financeiro-teste-"));
    pastasTemporarias.push(pasta);
    const caminho = join(pasta, "financeiro.db");
    const primeiroBanco = abrirBancoDados(caminho);
    inserirLancamento(primeiroBanco, { tipo: "receita", descricao: "Freela", valor: "72,30", categoria: "Extra", data: "2026-10-15" }, 7230);
    primeiroBanco.close();
    const segundoBanco = abrirBancoDados(caminho);
    expect(listarPorMes(segundoBanco, "2026-10")).toMatchObject([{ descricao: "Freela", valorCentavos: 7230 }]);
    segundoBanco.close();
  });

  it("usa DATABASE_PATH quando o caminho não é informado na chamada", () => {
    const pasta = mkdtempSync(join(tmpdir(), "financeiro-env-"));
    pastasTemporarias.push(pasta);
    const caminho = join(pasta, "data", "financeiro.db");
    const caminhoAnterior = process.env.DATABASE_PATH;
    try {
      process.env.DATABASE_PATH = caminho;
      const banco = abrirBancoDados();
      banco.close();
      expect(existsSync(caminho)).toBe(true);
    } finally {
      if (caminhoAnterior === undefined) delete process.env.DATABASE_PATH;
      else process.env.DATABASE_PATH = caminhoAnterior;
    }
  });

});
