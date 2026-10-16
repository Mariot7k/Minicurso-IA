import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import type { DatabaseSync } from "node:sqlite";
import { criarRotasLancamentos } from "./routes/lancamentos-routes";

export function criarAplicacao(banco: DatabaseSync): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/lancamentos", criarRotasLancamentos(banco));
  app.use((_erro: unknown, _req: Request, res: Response, _next: NextFunction) => {
    res.status(400).json({ error: "Corpo JSON inválido." });
  });
  return app;
}
