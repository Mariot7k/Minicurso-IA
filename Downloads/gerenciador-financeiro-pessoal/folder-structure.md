# Estrutura de pastas

```text
.
├── AGENTS.md
├── README.md
├── folder-structure.md
├── .agents/rules/
├── frontend/
│   ├── src/
│   │   ├── components/   # Formulário, seletor de mês, lista e resumo
│   │   ├── views/        # Tela financeira
│   │   ├── services/     # Chamadas à API
│   │   ├── hooks/        # Estado e carregamento
│   │   ├── utils/        # Formatação monetária e datas
│   │   └── types/        # Tipos da interface
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/       # Protocolo HTTP
│   │   ├── services/     # Validação e regras de negócio
│   │   ├── data/         # SQLite e repositório SQL
│   │   └── types/        # Tipos de domínio e resposta
│   ├── data/             # Arquivo SQLite local (gerado, não versionado)
│   └── package.json
├── e2e/                  # Testes Playwright ponta a ponta
└── Clinica2/             # Arquivos Java originais preservados, sem integração
```

## Regras de separação

- `routes` traduz requisições HTTP e códigos de resposta; não implementa regras de negócio complexas.
- `services` valida dados e coordena o comportamento financeiro.
- `data` mantém o esquema e executa consultas SQL parametrizadas.
- No frontend, `components` e `views` cuidam da interface; `services` conversa com a API e `hooks` encapsula estado reutilizável.
- `types` contém contratos usados entre camadas, com nomes e campos explícitos.
- Testes unitários e de integração ficam próximos do código em arquivos `*.test.ts` ou `*.test.tsx`; cenários de sistema ficam em `e2e/`.
- `.env`, arquivos SQLite, `node_modules`, `dist` e `coverage` não devem ser versionados.
