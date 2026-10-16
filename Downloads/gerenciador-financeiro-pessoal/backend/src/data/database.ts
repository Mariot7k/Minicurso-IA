import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const ESQUEMA = `
  CREATE TABLE IF NOT EXISTS lancamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    descricao TEXT NOT NULL CHECK (length(trim(descricao)) > 0),
    valor_centavos INTEGER NOT NULL CHECK (valor_centavos > 0),
    categoria TEXT NOT NULL CHECK (length(trim(categoria)) > 0),
    data TEXT NOT NULL CHECK (length(data) = 10)
  );
  CREATE INDEX IF NOT EXISTS idx_lancamentos_data ON lancamentos(data);
`;

export function abrirBancoDados(caminho?: string): DatabaseSync {
  const destino = caminho ?? process.env.DATABASE_PATH ?? "./data/financeiro.db";
  if (destino !== ":memory:") mkdirSync(dirname(resolve(destino)), { recursive: true });
  const banco = new DatabaseSync(destino);
  banco.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  banco.exec(ESQUEMA);
  return banco;
}
