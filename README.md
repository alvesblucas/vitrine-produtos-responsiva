# Agentes Exemplo · Vitrine de produtos responsiva

Vitrine fictícia de **licenças anuais de agentes de IA**, feita em React para portfólio de front-end.
O foco é interface responsiva, acessível e bem organizada, com código simples de explicar.

**Demo:** https://alvesblucas.github.io/vitrine-produtos-responsiva/

![Vitrine no desktop](docs/tela-desktop.png)

<p align="center">
  <img src="docs/tela-celular.png" alt="Vitrine no celular" width="320" />
</p>

> Os dados, os agentes e a loja são **fictícios**. O projeto não tem relação com nenhuma empresa,
> e os agentes não funcionam: é só uma vitrine.

## O que a vitrine faz

- Grade de cards responsiva: 1 coluna no celular, 2 no tablet, 3 no desktop e 4 em telas largas.
- Cada card mostra ilustração, categoria, nome, especialidade, preço da licença anual, parcelamento em 6x,
  seletor de quantidade de licenças e botão de adicionar ao carrinho.
- Contador de licenças no topo (estado local, sem back-end).
- Filtro por categoria e ordenação por nome, menor preço e maior preço.
- Navegação completa por teclado, foco visível e suporte a leitor de tela.
- Visual futurista: fundo de rede neural animada com paralaxe, entrada dos cards ao rolar,
  luz que segue o cursor e título que "decodifica" ao abrir.

## Tecnologias

- **React 19** com **Vite 8**, em JavaScript.
- **CSS puro**, mobile-first, com variáveis CSS e classes no padrão BEM.
- **Canvas 2D** para o fundo animado, sem biblioteca.
- **oxlint** para análise do código.
- **GitHub Actions + GitHub Pages** para publicar a demo a cada merge na `main`.
- Fontes **Unbounded**, **Manrope** e **JetBrains Mono** (Google Fonts).

As únicas dependências são React, Vite e oxlint: nenhuma biblioteca de componentes, estilo ou animação.

## Decisões e por quê

**Dados e preço**
- Preço guardado em **centavos (inteiro)**, para evitar erros de arredondamento do JavaScript (`0.1 + 0.2 !== 0.3`).
- Parcela calculada com `Math.floor` em centavos, para 6 parcelas nunca somarem mais que o preço.
- Formatação com `Intl.NumberFormat('pt-BR')`, nativo do navegador.
- Filtro e ordenação em **funções puras** (`src/utils/catalog.js`), separadas do React.
  Ordenação por nome com `localeCompare('pt-BR')`, que respeita acentos.

**Estado**
- Cada estado fica no componente que precisa dele: a quantidade no card (até o clique) e o carrinho no `App`
  (porque o header também usa).
- A lista exibida é **calculada a cada render** a partir do filtro e da ordenação, em vez de guardada num segundo estado,
  o que evita dados duplicados e dessincronizados. Com 8 itens, `useMemo` seria otimização prematura.
- O seletor de quantidade usa um "rascunho" enquanto a pessoa digita e só aplica o valor (limitado a 1–99)
  ao sair do campo ou apertar Enter.

**Layout**
- Grade com `minmax(0, 1fr)`: impede que uma palavra longa estoure a largura da coluna.
- Ações do card no rodapé com `margin-top: auto`, alinhadas mesmo com textos de tamanhos diferentes.
- Ilustrações com `width`/`height` e `aspect-ratio`: o espaço é reservado e o layout não "pula" ao carregar.

**Acessibilidade**
- HTML semântico: `header`, `main`, `article`, um único `h1`, `label` em todos os campos e `<select>` nativo.
- Contrastes medidos com a fórmula do WCAG: todo texto passa no nível AA, e as bordas dos campos têm no mínimo 3:1.
- Foco visível com `:focus-visible` e link "Pular para o conteúdo".
- Botões com nome único para o leitor de tela ("Adicionar ao carrinho: Revisor de Código"),
  e contador do carrinho anunciado com `aria-live`.
- Ilustrações com `alt=""`: elas repetem o nome do card, então são decorativas e não devem ser anunciadas.
- Todas as animações são desligadas para quem ativa "reduzir movimento" no sistema (`prefers-reduced-motion`).

**Efeitos sem pesar**
- Fundo em `<canvas>` com quantidade de pontos proporcional à tela e resolução limitada a 2×.
  O `requestAnimationFrame` pausa sozinho com a aba em segundo plano.
- Entrada dos cards com `IntersectionObserver`, que avisa quando o card aparece, em vez de calcular a rolagem o tempo todo.
- A luz que segue o cursor grava a posição em variáveis CSS, sem `useState`, então o card não re-renderiza a cada movimento do mouse.
- Aurora feita com `radial-gradient` em vez de `filter: blur()`, que é mais caro de animar.

**Ilustrações**
- As 8 ilustrações são SVGs próprios, gerados por `scripts/generate-agent-art.mjs` a partir dos dados.
  Elas compartilham a mesma "placa" e mudam só a cor da categoria e o símbolo da função.

## Estrutura

```
src/
  components/   Header, CatalogToolbar, ProductCard, QuantitySelector, NeuralBackground, DecodingText
  hooks/        useRevealOnScroll
  utils/        catalog.js (filtro, ordenação, cores), formatPrice.js
  data/         agents.json (dados fictícios)
public/agents/  ilustrações SVG
scripts/        gerador das ilustrações
```

## Como rodar

Requer **Node.js 20.19 ou mais novo**.

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run lint     # análise do código
npm run build    # build de produção em dist/
```

Para regerar as ilustrações depois de mudar os agentes: `node scripts/generate-agent-art.mjs`.

## Sobre o desenvolvimento

Projeto feito por **Lucas Alves** com apoio do **Claude Code**. Cada etapa foi planejada, revisada e validada
por mim antes de entrar na `main`, e o histórico de pull requests mostra o passo a passo.
