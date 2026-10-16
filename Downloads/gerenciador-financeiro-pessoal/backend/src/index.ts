import "dotenv/config";
import { criarAplicacao } from "./app";
import { abrirBancoDados } from "./data/database";
import { logger } from "./logger";

const PORT = Number(process.env.PORT ?? 3000);
const banco = abrirBancoDados();
const app = criarAplicacao(banco);
const servidor = app.listen(PORT, () => logger.info(`API financeira disponível em http://localhost:${PORT}`));
let encerrando = false;

function encerrarServidor(sinal: string): void {
  if (encerrando) return;
  encerrando = true;
  logger.info(`Sinal ${sinal} recebido; encerrando servidor HTTP.`);
  servidor.close((erro) => {
    if (erro) {
      logger.error(`Falha ao encerrar servidor: ${erro.message}`);
      process.exitCode = 1;
    }
    banco.close();
  });
}

process.on("SIGINT", () => encerrarServidor("SIGINT"));
process.on("SIGTERM", () => encerrarServidor("SIGTERM"));
