# Instruções do repositório

## Objetivo

Manter uma aplicação web simples de finanças pessoais para cadastrar receitas e despesas, consultar lançamentos por mês e calcular o saldo mensal. Antes de mudar código, leia as regras vinculadas abaixo. Não inclua autenticação, gráficos, importação bancária ou integrações externas sem pedido explícito.

## Mapa do projeto

- `frontend/`: React + TypeScript + Vite + Tailwind CSS. A interface de desenvolvimento roda na porta `5173` (`http://127.0.0.1:5173`).
- `backend/`: Node.js + TypeScript + Express. A API roda na porta `3000` e oferece `GET /health`, `GET /api/lancamentos?mes=AAAA-MM` e `POST /api/lancamentos`.
- `backend/src/routes/`: protocolo HTTP e respostas da API.
- `backend/src/services/`: validação de entrada e regras do saldo mensal.
- `backend/src/data/`: inicialização do SQLite e consultas parametrizadas.
- `backend/src/types/`: contratos tipados dos lançamentos e resumos.
- `frontend/src/components/`: campos, lista e cartões de resumo.
- `frontend/src/views/`: composição da tela financeira.
- `frontend/src/services/`: comunicação com a API.
- `frontend/src/hooks/`: estado e carregamento dos dados da tela.
- `frontend/src/types/`: contratos TypeScript do frontend.
- `frontend/src/utils/`: formatação de valores e datas.
- `e2e/`: testes Playwright fora do frontend/backend.
- `Clinica2/App.java` e `Clinica2/Paciente.java`: arquivos do material original, preservados sem alterações e sem integração com a aplicação financeira.

## Persistência e dinheiro

O banco SQLite local é criado automaticamente conforme `DATABASE_PATH` em `.env`. O padrão é `./data/financeiro.db` relativo à pasta `backend`. Nunca versione o banco nem arquivos `.env`. Armazene dinheiro como número inteiro de centavos; não some valores monetários usando ponto flutuante. Toda entrada deve ser validada na API e as consultas devem usar parâmetros, nunca concatenar entrada de usuário ao SQL.

## Instalação, execução, testes e build

Use Node.js 22.13+ e npm. Abra terminais separados na raiz do repositório.

Backend:

```bash
cd backend
npm ci
cp .env.example .env
npm run dev
```

Frontend, em outro terminal:

```bash
cd frontend
npm ci
cp .env.example .env
npm run dev
```

No PowerShell, use `Copy-Item .env.example .env` em vez de `cp`. A interface fica em `http://127.0.0.1:5173`; a API fica em `http://127.0.0.1:3000`.

Em `backend/` e `frontend/`, os comandos de verificação são `npm test`, `npm run lint`, `npm run typecheck` e `npm run build`. Para E2E, entre em `e2e/`, execute `npm ci`, `npx playwright install chromium` e `npm run test:e2e`. Consulte o README para detalhes sobre o banco de teste e os scripts disponíveis.

## Regras vinculadas

- [Padrões de codificação](.agents/rules/code-standards.md)
- [Regras de testes](.agents/rules/tests.md)
- [Padrões React](.agents/rules/react.md)
- [Padrões Node.js](.agents/rules/node.md)
- [Estrutura de pastas](folder-structure.md)
- [JavaScript e TypeScript](.agents/rules/javascript-typescript.md)

## Checklist antes de concluir uma tarefa

1. Confira validações, limites do mês selecionado e persistência se mexer em lançamentos.
2. Execute testes, linter, verificação de tipos e build nas pastas alteradas.
3. Revise `git diff` e nunca informe verificações como concluídas se não tiverem sido executadas.
