# Padrões Node.js

- Prefira `async/await` para operações assíncronas e trate erros explicitamente.
- Não bloqueie o event loop com cálculos síncronos pesados. Para cálculos CPU-bound relevantes, avalie workers ou processos separados.
- Guarde configuração e segredos em `.env`, carregado por `dotenv`; versione somente `.env.example`.
- Ao receber `SIGINT` ou `SIGTERM`, pare de aceitar conexões e feche recursos, inclusive servidor HTTP e banco de dados.
- Centralize `console.log` e `console.error` num adaptador de logging; não espalhe chamadas diretas pelo código.
- Versione `package-lock.json` e use `npm ci` nas verificações reproduzíveis.
- Evite dependências circulares; mantenha dependências fluindo de rotas para serviços e de serviços para dados.
- Use queries SQL parametrizadas. Para valores monetários, armazene centavos inteiros em vez de `float`/`double`.

```ts
const PORT = Number(process.env.PORT ?? 3000);
```
