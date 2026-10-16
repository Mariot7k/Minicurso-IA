# Regras de testes automatizados

**Regra crítica: todo código da aplicação deve ter testes automatizados. A meta mínima de cobertura é 80%; não ignore esta regra.** Cobertura não basta: valide retornos, erros e efeitos observáveis com assertions que realmente detectem regressões.

## Prioridade e isolamento

Teste primeiro operações críticas para o objetivo do sistema: validação de lançamento, soma em centavos, filtragem por mês e persistência. Um saldo mensal incorreto é mais crítico que um detalhe decorativo da interface.

- **Fast:** testes rápidos; prefira banco temporário/in-memory e substitua dependências externas lentas por stubs.
- **Independent:** cada teste deve funcionar sozinho e em qualquer ordem.
- **Repeatable:** controle relógio, datas, identificadores e estado compartilhado para reproduzir os resultados.
- **Self-validating:** o teste deve falhar quando o comportamento está errado.
- **Timely:** este princípio pode ser ignorado conforme a orientação da atividade.

## Estrutura do teste

Use AAA (Arrange, Act, Assert) ou Given/When/Then e teste um requisito por teste.

```ts
it("converte reais para centavos exatos", () => {
  const valor = "12,34";
  const resultado = converterValorEmCentavos(valor);
  expect(resultado).toBe(1234);
});
```

## Ferramentas e pirâmide

- Vitest para testes unitários e de integração no frontend e backend.
- Playwright para fluxos E2E, guardados em `e2e/` fora das aplicações.
- Mantenha uma base ampla de testes unitários, seguida por menos testes de integração e poucos E2E.
- Use stubs e mocks para evitar rede, APIs externas e relógio real quando isso tornaria o teste lento ou instável.

## Cenários essenciais

Teste lançamentos válidos e inválidos; valores zero, negativos, formato monetário e duas casas decimais; validação da API; soma de receitas/despesas; saldo como receitas menos despesas; mês vazio; isolamento entre meses; persistência depois de fechar e reabrir o banco; mensagens de sucesso e falha da interface.

Rode `npm test`, `npm run lint`, `npm run typecheck` e `npm run build` nos pacotes envolvidos. O teste E2E deve ser executado a partir de `e2e/` com Playwright instalado. Nunca declare um comando aprovado sem executá-lo.
