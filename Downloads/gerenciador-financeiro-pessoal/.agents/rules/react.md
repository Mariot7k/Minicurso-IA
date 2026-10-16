# Padrões React

## Componentes

Prefira componentes funcionais pequenos e reutilizáveis; cada componente deve ter no máximo 30 linhas. Extraia subcomponentes ou hooks quando houver múltiplas responsabilidades.

```tsx
type Props = { titulo: string };
export function Titulo({ titulo }: Props) {
  return <h2 className="text-lg font-semibold">{titulo}</h2>;
}
```

## Props, efeitos e cálculos

Evite `<input {...props} />`; declare explicitamente propriedades usadas. Não use `useEffect` para cálculos derivados ou para reagir diretamente a cliques; reserve-o à sincronização com sistemas externos, como carregar dados ao trocar o mês. Use `useMemo` para cálculos realmente custosos, não por padrão em toda expressão.

## Separação de responsabilidades

Componentes apresentam interface. Acesso à API fica em `services/`. Hooks com prefixo `use`, como `useFinanceiro`, guardam estado e lógica reutilizável. Prefira componentes funcionais.

## Acessibilidade e estilo

Use HTML semântico, labels associados aos campos, foco visível e `aria-*` quando forem apropriados. Evite atributos ARIA redundantes ou enganosos. Estilize com Tailwind CSS e mantenha contraste e responsividade.
