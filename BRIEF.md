# BRIEF: SubnetLab v2 (refatoração do simulador CCNA)

## Contexto

Projeto: simulador de estudos para o curso CCNA (Cisco Networking Academy) do SENAI.
Público: alunos brasileiros, iniciantes, estudando em português, com um celular na mão.
Objetivo: treinar para as provas do curso (quiz de módulo, checkpoint, exame final) e, depois, para a certificação Cisco (que é em inglês).

O app atual é um arquivo único de 780 KB (`reference/CCNA_SIMULATOR.html`) com 60 questões do módulo 2. Ele funciona, mas precisa ser refatorado para: (a) receber os 3 módulos, (b) ser compartilhável, (c) ser mantenível.

## Estado atual (já feito, NÃO refazer)

- `data/modulo2.js`: 60 questões já extraídas e normalizadas. Formato:
  ```js
  window.QUESTIONS_M2 = [
    { id, mod, fonte, tp, ty, text, opts?, cor?, sub, why, fig?, figAlt?, code?, pairs? }
  ]
  ```
  - `ty`: `"single"` (1 correta, `cor` é índice), `"multi"` (N corretas, `cor` é array de índices), `"match"` (associação, `pairs: [{l,r}]`)
  - `mod`: número do módulo (2 = SRWE; 1 = ITN e 3 = ENSA virão depois)
  - `fonte`: `"curso"` (prova do curso) ou `"certificacao"` (futuro)
  - `fig`: caminho relativo (`img/m2-q01.webp`)
  - `why`: **explicação didática da resposta correta** (já escrita, em PT-BR) e é o coração pedagógico do app
  - `text`: já em PT-BR. Haverá `text_en`/`opts_en` no futuro (modo bilíngue). **Prever o campo, não implementar agora**
- `img/`: 18 figuras em WebP otimizado
- `data/modulo2.json`: mesma coisa em JSON (para eventuais scripts)

## O que construir

Criar do zero, na raiz do repositório:

```
index.html          : shell do app (sem CSS/JS inline)
css/styles.css      : todos os estilos
js/app.js           : toda a lógica
manifest.json       : PWA
sw.js               : service worker (cache offline)
```

**Não alterar** `data/` nem `img/`. **Não commitar** nada (o deploy é feito pelo agente).

## Requisitos funcionais

### 1. Núcleo do quiz
- Carregar as questões de `data/modulo2.js` (script tag `defer`, antes do app.js). O app deve ler de um registry `window.QUESTIONS_M2` e ser trivial adicionar `M1`/`M3` depois (função que monta a lista a partir de todos os `window.QUESTIONS_M*` existentes).
- Renderizar os 3 tipos: `single` (radio), `multi` (checkbox, com "Escolha duas/três" no enunciado), `match` (associação por selects ou drag; prefira selects em mobile).
- Embaralhar a ordem das questões e das opções a cada tentativa (guardar a ordem para não mudar no meio da questão).
- Feedback **imediato** por questão: acertou/errou + **a resposta correta completa** + **a explicação (`why`)** sempre visível, com tipografia confortável. Isso é requisito central: o aluno precisa entender o porquê.
- Questões com `fig`: mostrar a imagem com `max-width:100%`, legenda (`figAlt`), e possibilidade de abrir em zoom (lightbox simples).
- Questões com `code`: bloco monoespaçado com scroll horizontal.

### 2. Modos de estudo
- **Livre**: sem cronômetro, feedback imediato, pode pausar.
- **Prova**: cronômetro (ex.: 1 min por questão), **sem feedback até o fim**, resultado só no final, com revisão posterior. Simula a prova real.
- **Por tópico**: filtrar por `tp`.
- **Por módulo**: seletor de módulo (hoje só "SRWE"; deixar a UI pronta para ITN e ENSA).
- **Revisão de erros**: refazer só as questões erradas.
- **Revisão espaçada**: questões acertadas voltam depois de N tentativas (algoritmo simples baseado em acertos/erros salvos).

### 3. Gamificação (manter a do original, que é boa)
- XP, níveis (Novato → Trainee → Júnior → Técnico → Especialista → Engineer → CCNA Ready), medalhas, streak, vidas.
- Barra de progresso, HUD compacto no topo.
- Resultado final com resumo por tópico, medalha e botão de compartilhar (gerar canvas de imagem para o aluno mandar no grupo).

### 4. Estatísticas
- Por tópico e por questão (acertos/tentativas).
- Por módulo.
- Histórico de sessões.
- Relatório de prontidão ("você está pronto?"): % geral, tópicos fracos, sugestão do que revisar.

### 5. Apoio ao estudo
- **Glossário de acrônimos** com tooltips (reaproveitar o objeto `ACRONYMS` do arquivo original. Copiar de `reference/CCNA_SIMULATOR.html`, linhas ~1996-2086).
- **Busca** de questões por texto.
- **Favoritos**.
- **Countdown** para a data da prova (configurável).

### 6. Persistência (IMPORTANTE)
- Usar **`localStorage`** apenas. **NÃO usar `window.storage`** (é API de outro ambiente; hoje o ranking da turma quebra silenciosamente por causa disso).
- Salvar: progresso da sessão, estatísticas por questão, histórico, favoritos, nome do aluno, tema, data da prova.
- **Exportar progresso** (baixar JSON) e **importar** (upload). O aluno não pode perder tudo ao trocar de celular.

### 7. PWA
- `manifest.json` (nome SubnetLab, ícone, tema escuro, display standalone).
- `sw.js` com cache-first para os assets locais (index, css, js, data, img): precisa funcionar offline na sala de aula.
- Botão/instrução de "instalar" no celular.

### 8. Design
- Manter a identidade visual do original: dark mode padrão, paleta `--bg:#0F1117`, `--bg2:#1A1D27`, verde `#1D9E75`, azul `#185FA5`, raio 10px, tipografia Segoe UI/system.
- Tema claro/escuro com toggle persistido.
- **Mobile-first**: o aluno usa celular. Alvo mínimo de toque 44px. `max-width: 680px` centralizado.
- **Remover `maximum-scale=1.0`** do viewport (bloqueia zoom e prejudica acessibilidade).
- Texto legível: mínimo 14px no corpo, 16px nas opções.
- Nada de dependências externas (sem CDN, sem fonte remota). Tem que funcionar offline.
- Acessibilidade: foco visível, `aria-label` nos botões de ícone, contraste adequado.

## Restrições técnicas

- **Vanilla JS**, sem framework, sem build step. O app tem que abrir com duplo clique (`file://`) **e** funcionar no GitHub Pages.
- Por isso os dados estão em `.js` (não `.json` com fetch). O `fetch` de JSON local falha em `file://` por CORS.
- Sem `eval`, sem `innerHTML` com dados não escapados (escapar texto de questão).
- Código organizado em seções comentadas; funções pequenas; nomes claros.
- Comentários e textos de UI em **PT-BR**.

## REGRA DO PROJETO: figuras originais (obrigatória)

**Nunca criar, recriar, desenhar ou "representar" uma figura de questão.** A figura exibida tem que ser a **imagem original** publicada na fonte oficial da questão.

Motivo: figuras recriadas mudam detalhes (nomes de interfaces, IPs, rótulos, topologia) e o aluno treina em cima de um cenário que não é o da prova.

Como aplicar:
1. Localizar a imagem original na fonte (`<img src=".../wp-content/uploads/...">` dentro do bloco da questão, ou o base64 do print da plataforma).
2. Baixar o arquivo original (nunca redesenhar).
3. Converter para WebP com largura máxima de 900px, qualidade ~82-84, fundo branco se tiver transparência.
4. Salvar em `img/m<modulo>-q<id>.webp`.
5. Referenciar na questão: `fig: "img/m3-q021.webp"` e preencher `figAlt` com uma descrição curta e fiel do que a figura mostra (não "diagrama da questão").
6. Se a questão não tiver figura na fonte, **não invente uma**: deixe `fig` vazio.

## Critérios de aceite

1. Abrir `index.html` por `file://` e o quiz funcionar completo nas 60 questões.
2. Acertar e errar mostram feedback com a resposta correta + explicação.
3. Modo prova esconde o feedback até o fim.
4. F5 mantém o progresso (localStorage).
5. Exportar/importar progresso funciona.
6. Layout utilizável em tela de 360px de largura.
7. `manifest.json` e `sw.js` válidos; app abre offline.
8. Nenhuma referência a `window.storage`.
9. Nenhum erro no console.

## Entrega

Ao terminar, rodar um checklist e reportar: arquivos criados, tamanho total, e o que ficou pendente (se algo). Não commitar.

---

## Atualizações depois deste BRIEF (nov/2026)

O que abaixo não estava previsto na especificação original e hoje está em produção. Leia antes de planejar
qualquer coisa, para não refazer o que já existe.

### Tela de módulos: selecionar ≠ entrar

Tocar num card **só seleciona/expande** (`S.pendingMod`, transitório, não persistido). A entrada acontece
**apenas** pelo CTA do card: `Iniciar` quando o destino tem 0 questões vistas, `Continuar` quando já tem
progresso. `S.selectedMod`/`sl_mod` só mudam na confirmação. Vale também para a linha "Revisão completa"
(mod 0) e **obrigatoriamente para qualquer ponto de entrada novo** nessa tela. Use `aria-pressed`
(não `aria-selected`, inválido em `role="button"`).

### Certificados

- Emitidos ao concluir uma **Prova** (modo cronometrado) com `>= CERT_MIN` (70%), para os módulos 0–4.
- Tipo por módulo: 1–3 → "Certificado de Conclusão de Curso"; 4 → "Certificado de Preparação para
  Certificação"; 0 → "Certificado de Revisão Completa".
- **Melhor nota não regride**: guardado localmente (`sl_certs`) e no banco (`cert_put`, que só grava se
  `p_pct > melhor`). Nota menor não sobrescreve e não notifica.
- Renderização em canvas (`certCanvas(info)`), reutilizável para reemitir certificado antigo.
- No perfil ("Meus certificados"): PNG, compartilhar (`navigator.share` com fallback para download) e
  imprimir (janela própria + `print()`, onde o aluno pode salvar em PDF).

### Sincronização e notificações

- `sbPush()` **junta com a nuvem antes de enviar** (`mergeSnapshots`); `syncPullMerge()` puxa no boot, no
  `focus` e no `visibilitychange`, com trava de 20s e nunca durante o quiz. Sem o merge, dois aparelhos se
  sobrescrevem. Foi um bug real, com perda de progresso.
- Sino (`#modNotif`) alimentado pela tabela `conquistas`; o próprio autor não recebe a sua conquista.
- Tabelas, RPCs e passo de instalação: ver "Nuvem (Supabase)" no `README.md` e `sql/certificados.sql`.

### Títulos sem "Módulo N"

A tela do módulo e o certificado usam o **nome do curso** (ex.: "Enterprise Networking, Security & Automation"),
sem o prefixo "Módulo 4".

### Revisão mostra a resposta do aluno

`S.answers[qKey(q)]` guarda a escolha de cada questão; a revisão pinta a alternativa errada e mostra
"Sua resposta: C ✗" (e, na associação, "✗ Você associou: …").
