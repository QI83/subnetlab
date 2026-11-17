# SubnetLab — Nuvem com Supabase (referência técnica)

Integração em produção. Este documento descreve o esquema atual e as regras de negócio que o banco impõe.

## Tabelas

### `public.alunos`

Um registro por aluno. O código de acesso é passado como argumento às RPCs — não existe coluna `code`
na tabela. O identificador interno é derivado do código dentro das funções `security definer`
e nunca fica exposto pela API pública.

| Coluna | Tipo | Detalhe |
|---|---|---|
| `nome` | `text` | apelido do aluno (2–30 chars) |
| `xp` | `integer` | XP total acumulado (≥ 0) |
| `dados` | `jsonb` | snapshot do progresso: `qStats`, `spaced`, `history`, `certs` |
| `criado_em` | `timestamptz` | primeira sincronização |
| `atualizado_em` | `timestamptz` | última sincronização |

RLS ligado, sem policies abertas → só acessível pelas funções abaixo.

### `public.certificados`

Melhor nota por `(code, mod)`. Nunca regride.

| Coluna | Tipo |
|---|---|
| `code` | `text` (parte da PK) |
| `mod` | `int` (parte da PK) |
| `pct` | `int` |
| `acertos` | `int` |
| `total` | `int` |
| `rank` | `text` |
| `emitido_em` | `timestamptz` |
| `atualizado_em` | `timestamptz` |

PK composta: `(code, mod)`.

### `public.conquistas`

Feed global de conquistas (alimenta o sino de notificações).

| Coluna | Tipo |
|---|---|
| `id` | `bigserial` (PK) |
| `code` | `text` |
| `nome` | `text` |
| `mod` | `int` |
| `pct` | `int` |
| `rank` | `text` |
| `criado_em` | `timestamptz` |

### `public.ranking` (view)

```sql
create or replace view public.ranking
  with (security_invoker = true) as
  select nome, xp, row_number() over (order by xp desc, nome asc) as posicao
  from public.alunos
  where xp > 0;
```

A opção `security_invoker = true` é obrigatória: faz a view executar com os privilégios de quem a lê
(a chave `anon`), e não com os do dono da view. Sem ela o Supabase Advisor marca *Security Definer View*
como **Critical** — e ainda pior: a view bypassaria o RLS e exporia `dados` (onde está o código de acesso).

Para a view funcionar com `security_invoker`, a role `anon` precisa de acesso explícito a colunas:

```sql
grant select (nome, xp) on public.alunos to anon;
```

**Sem esse grant a view retorna vazio** (RLS bloqueia). Com um grant amplo (`grant select on alunos to anon`)
a chave pública passaria a ler `dados` — expondo o identificador interno. O grant por coluna fecha esse vetor.

## RPCs

Todas chamadas com a chave `anon` (pública). Definidas como `security definer` para atravessar o RLS.

| Função | Parâmetros | Retorno | O que faz |
|---|---|---|---|
| `sync_put` | `p_code, p_nome, p_xp, p_dados` | `void` | MERGE do progresso (nunca sobrescreve com dados mais antigos) |
| `sync_get` | `p_code` | `(nome, xp, dados, atualizado_em)` | Lê o snapshot do aluno |
| `sync_delete` | `p_code` | `void` | Apaga todos os dados do aluno (direito ao esquecimento — LGPD) |
| `cert_put` | `p_code, p_mod, p_pct, p_acertos, p_total, p_rank` | `(melhor_pct, melhorou)` | Grava certificado **só se a nota for maior**; devolve a melhor nota e se houve melhora |
| `cert_list` | `p_code` | `(mod, pct, acertos, total, rank, emitido_em)` | Certificados de um aluno (tela de perfil) |
| `conquista_add` | `p_code, p_nome, p_mod, p_pct, p_rank` | `void` | Publica conquista no feed |
| `conquistas_list` | `p_excluir, p_limite` | `(id, nome, mod, pct, rank, criado_em)` | Feed do sino, excluindo as do próprio aluno |

## Regras de negócio impostas pelo banco

- **Melhor nota não regride**: `cert_put` só atualiza `certificados` se `p_pct > pct` atual. Retorna
  `melhorou = true` apenas nesse caso. O app só chama `conquista_add` quando `melhorou = true`.
- **Conquista só é anunciada quando melhora na nuvem**: evita duplicar o aviso em quem refaz a prova sem
  superar o próprio recorde.
- **Sincronização é merge, não substituição**: `sbPush` primeiro faz `sync_get`, junta os snapshots
  (qStats fica com o registro de mais tentativas, XP é o maior dos dois, histórico é união) e só então
  chama `sync_put`. Sem isso dois aparelhos se sobreescreveriam mutuamente.
- **Nunca sincroniza durante o quiz**: evita re-render no meio de uma questão.

## Montar um ambiente novo

1. Crie o projeto no Supabase (plano free é suficiente).
2. No **SQL Editor**, rode `sql/certificados.sql` inteiro (cria `certificados`, `conquistas` e todas as RPCs
   de certificados — é idempotente).
3. Ainda no SQL Editor, rode `docs/setup.sql` (cria `alunos`, `sync_put/get/delete`, `ranking` e os grants).
4. No topo de `js/app.js`, ajuste:
   ```js
   const SB_URL = 'https://<seu-projeto>.supabase.co';
   const SB_KEY = '<sua-anon-key>';
   ```
   Use a chave `anon` / `public`. **Nunca** coloque a `service_role` no frontend.

### Chaves de acesso

| Campo no painel | O que é | Pode ir no frontend? |
|---|---|---|
| `Project URL` | `https://xxxxx.supabase.co` | ✅ sim |
| `anon` / `public` key | chave pública | ✅ sim (a segurança vem do RLS + funções `security definer`) |
| `service_role` / `secret` | chave mestra | ❌ **nunca** — dá acesso irrestrito ao banco |

## Armadilhas conhecidas

| Sintoma | Causa | Solução |
|---|---|---|
| Supabase Advisor marca `ranking` como *Security Definer View* (Critical) | View criada sem `security_invoker = true` | Recriar a view com a opção (ver `docs/setup.sql`) |
| Ranking sempre vazio | `security_invoker = true` ligado mas sem `grant select (nome, xp) on alunos to anon` | Rodar o grant por coluna |
| `sync_put` retorna erro 400 | Código de acesso nulo ou com menos de 16 caracteres alfanuméricos | Verificar que `localStorage['sl_code']` está presente no cliente |
| Free tier pausa por inatividade | ~1 semana sem nenhum request | Reativar com 1 clique no painel — irrelevante com uso de turma |

## Segurança

- A `anon key` é pública por design. A proteção vem do RLS e das funções `security definer`.
- O grant por coluna em `alunos (nome, xp)` garante que a chave pública nunca leia `dados` (onde está
  o identificador interno do aluno).
- Nenhum dado pessoal (e-mail, CPF, telefone, senha) é coletado. Só apelido + estatísticas de quiz.
- `sync_delete` apaga tudo (LGPD).
