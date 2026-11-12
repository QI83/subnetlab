# SubnetLab

<p align="center">
  <img src="img/logo-subnetlab.webp" alt="SubnetLab" width="520">
</p>


Simulador de estudos para o **CCNA** (Cisco Certified Network Associate) — feito para a turma do SENAI Vila Mariana.

Treine para as provas do curso e para a certificação com questões em **português**, explicação da resposta e progresso salvo no seu aparelho.

## Como usar

**Online:** abra **https://qi83.github.io/subnetlab/** no navegador — no PC ou no celular.

**Offline / no celular:** baixe o projeto, abra `index.html` no navegador e use o botão *Instalar* (PWA). Funciona sem internet depois da primeira abertura.

> Dica: no celular, use o menu do navegador → **"Adicionar à tela de início"**. Vira um app.

## O que tem

- **Quiz** com 3 tipos de questão: múltipla escolha, escolha múltipla e associação.
- **Explicação da resposta correta** em toda questão — o objetivo é aprender, não só acertar.
- **Modos**: estudo livre, prova cronometrada (sem feedback até o fim), por tópico, por módulo, revisão de erros e **revisão espaçada de verdade** (algoritmo SM-2).
- **Certificado simbólico**: ao alcançar 70% ou mais no modo prova, o app emite um certificado com rank
  (Mestre CCNA, Expert em Redes, CCNA Aprovado, Técnico de Redes), que pode ser baixado em PNG.
- **Gamificação**: XP, níveis, medalhas, streak e sequência de acertos.
- **Estatísticas** por tópico, por questão e por módulo, com relatório de prontidão.
- **Glossário** de acrônimos (Cisco adora siglas) com tooltip.
- **Progresso local** (localStorage) com exportar/importar — trocou de celular, não perdeu nada.

### Revisão espaçada (SM-2)

Cada questão guarda `intervalo`, `próxima revisão`, `facilidade` e `repetições`. Acertou, o intervalo
cresce (1 dia → 6 dias → intervalo × facilidade); errou, volta para 1 dia. O card do modo mostra
quantas questões estão vencidas hoje.

## Módulos

| Módulo | Curso | Status |
|---|---|---|
| 1 | ITN — Introduction to Networks | 🚧 em breve |
| 2 | SRWE — Switching, Routing and Wireless Essentials | ✅ 60 questões |
| 3 | ENSA — Enterprise Networking, Security, and Automation | ✅ 55 questões (exame final) |
| 4 | **Preparação para a Certificação** | ✅ **90 questões (Exame 200-301)** |

### Módulo 4 — Preparação para a Certificação

O número do módulo é o **exame de certificação (90 questões)**. As questões de ENSA e SRWE ficam
disponíveis como material de apoio, no seletor de escopo:

| Escopo | Questões |
|---|---|
| **Exame 200-301** (exame prático de certificação) | **90** |
| ENSA (exame final do curso) | 55 |
| SRWE (exame final do curso) | 60 |
| **Total de material disponível** | **205** |

Dentro do módulo há um seletor de escopo: **Tudo do módulo**, **ENSA**, **SRWE** ou **Exame 200-301**. A escolha fica salva entre sessões.

O exame de certificação cobre os **três cursos**: SRWE (45 questões), ENSA (29) e ITN (16).

## Estrutura

```
index.html          shell do app
css/styles.css      estilos
js/app.js           lógica
data/modulo2.js     questões do módulo 2 (window.QUESTIONS_M2)
data/modulo2.json   mesma coisa em JSON (para scripts)
data/modulo3.js     questões do módulo 3 (window.QUESTIONS_M3)
data/modulo3.json   mesma coisa em JSON (para scripts)
data/modulo4.js     questões do módulo 4 (window.QUESTIONS_M4)
img/                figuras em WebP, logo, ícones e favicon
manifest.json       PWA
sw.js               service worker (offline)
docs/               especificação da v2.0 e mídia
prototype/          protótipos isolados (não integrados ao app)
reference/          simulador original (histórico)
BRIEF.md            especificação técnica do projeto
```

## Roadmap — v2.0 (ranking na nuvem)

> **Status: não implementado.** Nada está configurado ainda — não existe projeto no Supabase, e o
> app não faz nenhuma chamada de rede. Tudo continua 100% local (`localStorage`).

O que existe hoje é **material de planejamento**:

- [`docs/V2-SUPABASE.md`](docs/V2-SUPABASE.md) — a especificação: decisões de produto, o SQL das
  tabelas (`profiles`, `progresso`), as regras de acesso (RLS), a view de ranking e o passo a passo
  de configuração (~15 min). É um documento para seguir, não um recurso ativo.
- [`prototype/ranking-demo.html`](prototype/ranking-demo.html) — uma página separada que **exige que
  você crie um projeto no Supabase** e cole a URL e a chave nele para funcionar. Serve para testar a
  ideia do ranking antes de integrar.

### O que faltaria para a v2.0 existir

1. Criar o projeto gratuito no Supabase e rodar o SQL do `docs/V2-SUPABASE.md`.
2. Testar o protótipo apontando para esse projeto.
3. Integrar no app: enviar o XP a cada sessão e exibir o ranking na tela de módulos.
4. Decidir sobre LGPD: o ranking é público por nome, então precisa de consentimento e de uma forma
   de o aluno apagar o próprio perfil.

## Adicionar questões

Crie `data/moduloN.js`:

```js
window.QUESTIONS_M3 = [
  {
    id: 1, mod: 3,
    fonte: "curso",                   // M2/M3: "curso" | M4: "ensa" | "srwe" | "cert"
    tp: "OSPF",                       // tópico
    ty: "single",                     // single | multi | match
    text: "Enunciado em português.",
    opts: ["Alternativa A", "Alternativa B", "Alternativa C"],
    cor: 1,                           // single: índice | multi: array de índices
    sub: "Resumo curto da resposta",
    why: "Explicação didática do porquê.",
    fig: "img/m3-q01.webp",           // opcional: figura original da fonte
    figAlt: "Descrição da figura",    // opcional
    code: "R1# show ip ospf\n...",    // opcional: tela CLI (só quando a figura é só comandos)
    pairs: [{ l: "lado A", r: "lado B" }]  // só para ty: "match"
  }
];
```

Depois inclua o `<script defer src="data/moduloN.js">` no `index.html`. O app detecta automaticamente qualquer `window.QUESTIONS_M*`.

### 📌 Regra obrigatória: figuras originais

**Toda figura de questão deve ser a imagem original da fonte oficial — nunca uma recriação ou desenho "representativo".**

Figuras redesenhadas mudam detalhes (nomes de interface, IPs, rótulos, topologia) e o aluno acaba treinando num cenário diferente do da prova.

Passo a passo:
1. Localize a imagem original na fonte da questão.
2. Baixe o arquivo original (não redesenhe).
3. Converta para WebP, largura máx. 900px, qualidade ~82-84.
4. Salve em `img/m<modulo>-q<id>.webp`.
5. Referencie: `fig: "img/m3-q021.webp"` + `figAlt` com descrição curta e fiel.
6. Sem figura na fonte? Deixe `fig` vazio — **não invente**.

## Rodar localmente

Nenhum build, nenhuma dependência. Duplo clique em `index.html`.

Se quiser servir por HTTP (recomendado para testar o PWA):

```bash
python -m http.server 8000
# abra http://localhost:8000
```

## Contribuir

Sugestões e correções de questões são bem-vindas — abra uma *issue* ou mande no grupo da turma.

## Aviso

Projeto de estudo, sem fins comerciais. As questões derivam do material público do curso CCNA da Cisco Networking Academy. Cisco, CCNA e NetAcad são marcas da Cisco Systems, Inc.
