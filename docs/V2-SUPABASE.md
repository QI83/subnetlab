# SubnetLab v2.0 — Progresso na nuvem com código de acesso

> **Status:** especificação aprovada. Integração ao app **ainda não implementada**.
> Decisão de produto fechada com o Caique em 13/11/2026.

## A decisão: código de acesso, não login

O aluno **não cria conta**. Na primeira vez que abre o app, ele recebe um código:

```
7K4X-M9P2-QW3E-RT5Y
```

- No dia a dia ele **não digita nada** — o código fica salvo no aparelho.
- Em outro celular ou computador: *"Já estudo aqui"* → digita o código → o progresso vem.
- O app insiste, na primeira vez, para ele **salvar o código** (copiar, compartilhar no próprio
  WhatsApp ou baixar um arquivo).

### Por que não auth anônima (a versão anterior desta spec)

A auth anônima do Supabase é mais simples, mas amarra o progresso ao `localStorage` do aparelho:
trocou de celular, limpou o navegador, ou abriu o computador da escola → **progresso perdido**, e o
aluno só descobre quando é tarde. O código de acesso resolve isso sem pedir e-mail, senha ou qualquer
dado pessoal.

### Segurança

| Item | Decisão |
|---|---|
| Entropia | 16 caracteres em alfabeto de 32 (sem `I`, `O`, `0`, `1`) = **80 bits** |
| O servidor guarda | Apenas o **SHA-256** do código (`code_hash`), nunca o código em si |
| Quem tem o código | Acessa o progresso daquele aluno — é o modelo "chave de recuperação" |
| Dado sensível | **Nenhum**: apelido + estatísticas de quiz. Sem e-mail, telefone, CPF ou senha |
| LGPD | `delete_me()` apaga tudo; aviso na primeira execução |

O ranking é público (nome + XP) — é o preço de um ranking entre colegas. O progresso individual
**nunca** é exposto.

## Passo a passo no painel do Supabase

O projeto já foi criado. Faltam três coisas:

### 1. Rodar o SQL

**SQL Editor** → *New query* → colar o script completo abaixo → **Run**.

Deve aparecer "Success. No rows returned".

### 2. Pegar as credenciais

**Project Settings** (engrenagem) → **API** → *Project URL* e *API Keys*:

| Campo no painel | O que é | Pode ir no site? |
|---|---|---|
| `Project URL` | `https://xxxxx.supabase.co` | ✅ sim |
| `anon` / `public` | chave pública | ✅ sim (a segurança vem das policies) |
| `service_role` / `secret` | chave mestra | ❌ **NUNCA** — dá acesso total ao banco |

### 3. Me mandar a URL e a anon key

Com esses dois valores eu integro o app. **Não** mande a `service_role`.

## SQL completo

```sql
-- ─────────────────────────────────────────────────────────────
-- 0. pgcrypto (digest/sha256). No Supabase já vem em `extensions`.
-- ─────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- 1. ALUNOS — um registro por código de acesso
--    A chave primária é o HASH do código, não o código.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.alunos (
  code_hash      text primary key,
  nome           text not null check (char_length(nome) between 2 and 30),
  xp             integer not null default 0 check (xp >= 0),
  dados          jsonb not null default '{}'::jsonb,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. RLS LIGADO E SEM POLICY = ninguém acessa a tabela direto
--    pela API pública. Todo acesso passa pelas funções abaixo.
-- ─────────────────────────────────────────────────────────────
alter table public.alunos enable row level security;

-- ─────────────────────────────────────────────────────────────
-- 3. GRAVAR / ATUALIZAR o progresso
--    p_dados = { qStats, spaced, history }  (o mesmo JSON do export)
-- ─────────────────────────────────────────────────────────────
create or replace function public.sync_put(
  p_code  text,
  p_nome  text,
  p_xp    integer,
  p_dados jsonb
) returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  h text;
begin
  if p_code is null or char_length(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')) < 16 then
    raise exception 'codigo_invalido';
  end if;
  if p_nome is null or char_length(trim(p_nome)) < 2 then
    raise exception 'nome_invalido';
  end if;

  h := encode(digest(upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')), 'sha256'), 'hex');

  insert into public.alunos (code_hash, nome, xp, dados)
  values (h, trim(p_nome), greatest(coalesce(p_xp, 0), 0), coalesce(p_dados, '{}'::jsonb))
  on conflict (code_hash) do update
    set nome          = excluded.nome,
        xp            = excluded.xp,
        dados         = excluded.dados,
        atualizado_em = now();
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 4. LER o progresso a partir do código
-- ─────────────────────────────────────────────────────────────
create or replace function public.sync_get(p_code text)
returns table (nome text, xp integer, dados jsonb, atualizado_em timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  h text;
begin
  if p_code is null or char_length(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')) < 16 then
    return;  -- código curto: não devolve nada (não vaza se existe ou não)
  end if;

  h := encode(digest(upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')), 'sha256'), 'hex');

  return query
    select a.nome, a.xp, a.dados, a.atualizado_em
    from public.alunos a
    where a.code_hash = h;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 5. RANKING — só nome + XP + posição. Nunca o progresso.
-- ─────────────────────────────────────────────────────────────
create or replace view public.ranking as
  select
    nome,
    xp,
    row_number() over (order by xp desc, nome asc) as posicao
  from public.alunos
  where xp > 0;

-- ─────────────────────────────────────────────────────────────
-- 6. APAGAR TUDO (direito ao esquecimento — LGPD)
-- ─────────────────────────────────────────────────────────────
create or replace function public.sync_delete(p_code text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  h text;
begin
  if p_code is null or char_length(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')) < 16 then
    return;
  end if;
  h := encode(digest(upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')), 'sha256'), 'hex');
  delete from public.alunos where code_hash = h;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 7. PERMISSÕES — só o necessário, e só pelas funções
-- ─────────────────────────────────────────────────────────────
revoke all on public.alunos from anon, authenticated;
grant execute on function public.sync_put(text, text, integer, jsonb) to anon;
grant execute on function public.sync_get(text)                      to anon;
grant execute on function public.sync_delete(text)                   to anon;
grant select on public.ranking to anon;

-- ─────────────────────────────────────────────────────────────
-- 8. ÍNDICE para o ranking (ORDER BY xp DESC)
-- ─────────────────────────────────────────────────────────────
create index if not exists alunos_xp_idx on public.alunos (xp desc);
```

## Geração do código no cliente (sem dependência)

```js
const ALFA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 chars, sem I O 0 1

function gerarCodigo() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let s = '';
  for (const b of bytes) s += ALFA[b % 32];      // 16 chars = 80 bits
  return s.match(/.{4}/g).join('-');              // 7K4X-M9P2-QW3E-RT5Y
}

const normalizar = c => String(c).toUpperCase().replace(/[^A-Z0-9]/g, '');
```

`b % 32` sobre bytes uniformes é enviesado por no máximo 1/256 — irrelevante aqui, mas se quiser
zero viés use `crypto.getRandomValues(new Uint32Array(16))` e `% 32` sobre 32 bits.

## Integração no app (quando implementar)

- `localStorage['sl_code']` guarda o código no aparelho. **É a única chave fora do `sl_*` padrão
  que precisa sobreviver** — se ela sumir, o aluno perde a ligação com o servidor.
- O sync é **oportunista**: `localStorage` manda, o Supabase é espelho. Tentar em três momentos —
  ao abrir o app, ao terminar uma sessão e no evento `online`. Nunca bloquear o quiz esperando rede.
- Subir `{ qStats, spaced, history }` — o mesmo objeto do export. Não subir o nome do aparelho nem
  qualquer metadado de navegador.
- Conflito: **o servidor não sobrescreve o local** no `pull`. Na primeira vinculação, o app pergunta:
  "usar o progresso deste aparelho ou o da nuvem?" e faz a união das questões (maior `a`, maior `c`).

## Pontos de atenção

1. **Ranking é de confiança, não à prova de fraude.** O XP vem do navegador. Para a turma, aceitável.
   Se precisar de rigor: Edge Function que valida as respostas contra o gabarito no servidor.
2. **Free tier pausa por inatividade** (~1 semana). Reativa com 1 clique. Irrelevante com uso de turma.
3. **A anon key é pública por design.** Quem protege é o RLS + as funções `security definer`.
   Nunca colocar a `service_role` no frontend.
4. **`code_hash` é a chave.** Se alguém obtiver o banco, não obtém os códigos (só os hashes).
   Mas 80 bits com SHA-256 sem salt é atacável só por força bruta — inviável para um código aleatório.

## Roadmap

| Versão | Conteúdo |
|---|---|
| **v1 (atual)** | 100% local, export/import manual |
| **v2.0 (esta spec)** | Código de acesso, sincronização oportunista, ranking público de XP |
| **v2.1** | Ranking por turma (campo `turma`), filtros e pódio da semana |
| **v2.2** | XP validado no servidor (Edge Function) + estatísticas agregadas da turma |
