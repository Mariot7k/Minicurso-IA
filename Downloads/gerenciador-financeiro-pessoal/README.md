# Gerenciador financeiro pessoal

Aplicação web didática para registrar receitas e despesas e acompanhar o saldo mensal. A aplicação financeira fica em `frontend/` e `backend/`. Os arquivos `Clinica2/App.java` e `Clinica2/Paciente.java` foram preservados sem alterações e são independentes do fluxo financeiro.

## Funcionalidades

- Cadastro de receita ou despesa com descrição, valor, categoria e data.
- Consulta dos lançamentos por mês, com lista vazia e totais zerados quando não houver dados.
- Resumo de receitas, despesas e saldo (receitas menos despesas).
- Persistência local em SQLite, inclusive após reiniciar o servidor.
- Validação no frontend e novamente na API. Valores são armazenados como inteiros em centavos; a API recebe o valor decimal como texto e utiliza consultas SQL parametrizadas.
- Mensagens em português para sucesso, validação e erros.

O escopo deliberadamente não inclui autenticação, gráficos, importação bancária nem integrações externas. Trata-se de um projeto didático local, sem conta de usuário nem criptografia de dados financeiros.

## Tecnologias, pastas e portas

- `frontend/`: React, TypeScript, Vite e Tailwind CSS. Desenvolvimento em `http://127.0.0.1:5173`.
- `backend/`: Node.js, TypeScript, Express e SQLite pelo módulo nativo `node:sqlite`. API em `http://127.0.0.1:3000`.
- `backend/data/financeiro.db`: banco local criado automaticamente. A pasta e o banco não devem ser versionados.
- `e2e/`: testes de fluxo completo com Playwright, separados das aplicações.
- `Clinica2/`: os dois arquivos Java originais do material, preservados sem alterações e não integrados à aplicação financeira.
- `.agents/rules/`: instruções de codificação, testes, React, Node.js e TypeScript para uso por pessoas e LLMs.

Use Node.js 22.13 ou superior para o módulo nativo SQLite; o Node 22 pode exibir um aviso informando que `node:sqlite` ainda é experimental.

## Configuração e execução

Abra um terminal na raiz do projeto. São necessários Node.js e npm. Execute em terminais separados.

### 1. Backend

```bash
cd backend
npm ci
```

Copie `.env.example` para `.env` e depois inicie a API:

```bash
npm run dev
```

No PowerShell, a cópia pode ser feita com `Copy-Item .env.example .env`; no macOS/Linux, use `cp .env.example .env`. O banco é criado automaticamente no caminho definido por `DATABASE_PATH` (padrão `./data/financeiro.db`, relativo à pasta `backend`).

### 2. Frontend

Em outro terminal, a partir da raiz:

```bash
cd frontend
npm ci
```

Copie `.env.example` para `.env` e execute:

```bash
npm run dev
```

Acesse `http://127.0.0.1:5173`. O frontend usa `VITE_API_URL`, com padrão `http://localhost:3000`.

## Testes e verificações

Execute em cada pasta:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Em `backend/` e `frontend/`, execute os comandos de teste, lint, verificação de tipos e build. Para testes ponta a ponta, instale as dependências e execute a partir de `e2e/`:

```bash
npm ci
npx playwright install chromium
npm run test:e2e
```

A configuração Playwright inicia frontend e backend localmente. O E2E utiliza um banco separado (`backend/data/e2e-financeiro.db`).

## API

- `GET /health`: verifica se a API está ativa.
- `GET /api/lancamentos?mes=AAAA-MM`: retorna os lançamentos e totais do mês.
- `POST /api/lancamentos`: recebe `tipo`, `descricao`, `valor` (texto decimal como `"12,34"`), `categoria` e `data` (`AAAA-MM-DD`).

Os valores de saída são expressos em centavos inteiros (`valorCentavos`, `receitasCentavos`, `despesasCentavos`, `saldoCentavos`) para evitar aritmética monetária com ponto flutuante. O formato de valor aceita até duas casas decimais, com vírgula ou ponto, sem separador de milhar.
