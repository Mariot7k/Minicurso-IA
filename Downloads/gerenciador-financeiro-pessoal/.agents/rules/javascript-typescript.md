# Boas práticas JavaScript e TypeScript

## Variáveis e comparação

Prefira `const`; use `let` apenas quando a variável precisar mudar e nunca use `var`. Use `===` e `!==`, nunca `==` ou `!=`.

```ts
const categoria = "alimentação";
let tentativas = 0;
tentativas += 1;
if (categoria === "alimentação") processarCategoria();
```

## Tipagem e funções

Nunca use `any`. Prefira tipos específicos, unions e `unknown` acompanhado de validação. Tipos de parâmetros e retornos que envolvam objetos ou contratos públicos devem ser explícitos. Prefira arrow functions em callbacks (`map`, `filter`, `reduce`); funções principais exportadas podem usar `function` quando mais legível.

## Ternários

Use ternários somente para decisões simples e jamais os aninhe.

```ts
const rotulo = saldoCentavos < 0 ? "Saldo negativo" : "Saldo positivo";
```

## Verificações

Ao concluir cada tarefa, rode o linter, testes, verificação de tipos e build apropriados. Corrija falhas antes de concluir e não silencie erros com casts inseguros ou `as any`.
