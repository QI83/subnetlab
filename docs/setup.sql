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
