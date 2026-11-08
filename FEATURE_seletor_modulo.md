# FEATURE — Seletor de módulo (M1 / M2 / M3)

Arquivo: `js/app.js` (+ `css/styles.css` se precisar). O app já junta todos os
`window.QUESTIONS_M*` em `Q`, mas hoje o título está fixo como "Módulo 2 — SRWE"
e não existe seletor. Com o módulo 3 entrando, isso precisa mudar.

## O que implementar

### 1. Estado
- Adicionar `S.selectedMod` (número ou `0` = todos).
- Persistir em `localStorage` (chave `sl_mod`, no mesmo padrão das outras).
- Padrão: o menor módulo disponível (hoje 2; quando entrar o 1, vira 1). Se não houver escolha salva, manter o comportamento atual.

### 2. Pool
- Em `buildPool()`, manter:
  - `ALL` = todas as questões de todos os módulos (não filtrado)
  - `Q` = subconjunto filtrado por `S.selectedMod` (quando `0`, = `ALL`)
- Toda a lógica existente (quiz, revisão, busca, favoritos, stats) deve continuar funcionando sobre `Q`.
- Cuidado: `S.order` guarda índices de `Q`. Ao trocar de módulo, zerar/invalidar `S.order` e a sessão em andamento.

### 3. UI — seletor na tela inicial
- Mostrar **apenas se houver mais de um módulo** disponível (`mods.length > 1`).
- Usar chips horizontais (mesmo estilo dos `tpill`), acima do bloco "Modo de Estudo".
- Rótulos:
  - `Módulo 1 — ITN`
  - `Módulo 2 — SRWE`
  - `Módulo 3 — ENSA`
  - (se houver mais de 1) `Todos`
- Mostrar a contagem por módulo: `Módulo 3 — ENSA · 481 questões`.
- Ao clicar, atualizar `S.selectedMod`, salvar, e re-renderizar a tela inicial.

### 4. Textos dinâmicos
- Subtítulo do título: `Módulo <N> — <sigla> · <Q.length> questões` (ou `Todos os módulos · <N> questões`).
- Cabeçalho da lista de tópicos: `Tópicos — Módulo <N>` (ou `Tópicos — Todos`).
- A lista de tópicos (`topics`) deve sair de `Q`, não de `ALL`.

### 5. Estatísticas
- As estatísticas por questão e por tópico já usam `Q`/`S.topicStats` — garantir que refletem o módulo selecionado.
- No histórico, mostrar o módulo de cada sessão (adicione `mod` ao registro salvo).

### 6. Acessibilidade
- Chips com `role="tab"`, `aria-selected`, foco visível, área de toque ≥ 44px.

## Critérios de aceite
1. Com M2 + M3 carregados, a tela inicial mostra o seletor com 2 opções (ou 3, se "Todos").
2. Trocar de módulo muda a contagem de questões e a lista de tópicos.
3. Iniciar um quiz no M3 só traz questões do M3.
4. F5 mantém o módulo escolhido.
5. Com apenas M2 (sem M3), o seletor fica oculto e o app se comporta como hoje.
6. Nenhum erro no console.

Não commitar.
