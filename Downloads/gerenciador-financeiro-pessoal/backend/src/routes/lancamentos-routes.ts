import { Router } from "express";
import type { DatabaseSync } from "node:sqlite";
import { logger } from "../logger";
import { ErroValidacao } from "../services/erro-validacao";
import { cadastrarLancamento, listarResumoMensal } from "../services/lancamento-service";

export function criarRotasLancamentos(banco: DatabaseSync): Router {
  const rotas = Router();
  rotas.get("/", (req, res) => {
    try {
      const mes = typeof req.query.mes === "string" ? req.query.mes : "";
      res.json(listarResumoMensal(banco, mes));
    } catch (erro: unknown) {
      responderErro(res, erro);
    }
  });
  rotas.post("/", (req, res) => {
    try {
      res.status(201).json(cadastrarLancamento(banco, req.body as unknown));
    } catch (erro: unknown) {
      responderErro(res, erro);
    }
  });
  return rotas;
}

function responderErro(res: import("express").Response, erro: unknown): void {
  if (erro instanceof ErroValidacao) {
    res.status(400).json({ error: erro.message });
    return;
  }
  logger.error(erro instanceof Error ? erro.message : "Erro inesperado na API financeira.");
  res.status(500).json({ error: "Não foi possível concluir a operação. Tente novamente." });
}
