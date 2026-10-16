# Testes E2E

Os testes usam Playwright e cobrem o cadastro de um lançamento pela interface até sua exibição na lista.

```bash
npm ci
npx playwright install chromium
npm run test:e2e
```

A configuração inicia frontend e backend nas portas `5173` e `3000`, utilizando o banco de teste `backend/data/e2e-financeiro.db`. Não use dados financeiros reais neste ambiente de demonstração.
