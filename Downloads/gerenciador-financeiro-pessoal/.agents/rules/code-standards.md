# Padrões de codificação

## Comentários

Evite comentários. Use-os somente quando forem absolutamente necessários, por exemplo para explicar uma expressão regular complexa ou uma decisão técnica não óbvia.

```ts
// Evitar: comentário que apenas repete o código
const total = preco * quantidade;
const totalDoMes = receitasCentavos - despesasCentavos;
```

## Limites de tamanho

Arquivos `.ts` e classes devem ter no máximo 100 linhas; métodos, funções e componentes React devem ter no máximo 30 linhas. Ao ultrapassar os limites, divida responsabilidades em módulos, funções ou componentes pequenos sem prejudicar a legibilidade.

```ts
function calcularSaldo(receitasCentavos: number, despesasCentavos: number): number {
  return receitasCentavos - despesasCentavos;
}
```

## Condicionais e parâmetros

Não aninhe mais de três níveis de `if/else`. Prefira cláusulas guarda e `early return`. Evite mais de três parâmetros; agrupe valores relacionados em objetos tipados.

```ts
function validarValor(valorCentavos: number): void {
  if (valorCentavos <= 0) throw new Error("O valor deve ser positivo.");
}
```

## Legibilidade e constantes

Evite linhas em branco dentro de funções. Linhas entre funções ou membros de classes são aceitáveis. Extraia números e strings mágicos para constantes nomeadas quando representam regras ou configuração. Declare variáveis perto do uso e no menor escopo possível.

## Segurança

Nunca inclua chaves, senhas ou tokens no código. Use `.env` com `dotenv` ou o mecanismo adequado. O `.env` deve estar no `.gitignore`; mantenha apenas `.env.example` sem segredos reais.

## Responsabilidade por camada

Não misture interface, regras de negócio, HTTP e SQL no mesmo módulo. Preserve SQL parametrizado, tipagem explícita e mensagens de erro compreensíveis. Não crie abstrações sem necessidade real.
