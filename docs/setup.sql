-- ============================================================
-- SubnetLab — setup completo do banco Supabase
-- Cole no SQL Editor e rode. É idempotente.
--
-- IMPORTANTE: rode sql/certificados.sql PRIMEIRO.
-- Esse arquivo cria certificados, conquistas e as RPCs
-- cert_put / cert_list / conquista_add / conquistas_list.
-- Este arquivo cuida apenas de: alunos, sync RPCs, ranking.
-- ============================================================

-- ============================================================
-- 0) pgcrypto — necessário para digest/sha256 nas sync RPCs.
--    No Supabase já vem disponível em extensions.
-- ============================================================
create extension if not exists pgcrypto;

-- ============================================================
-- 1) ALUNOS — um registro por aluno
--    Colunas: nome, xp, dados, code_hash, criado_em, atualizado_em.
--    O código de acesso NUNCA é guardado em claro: as RPCs recebem o
--    código, calculam SHA-256 do valor normalizado e gravam em code_hash.
--    Essa coluna não tem grant para anon, então a chave pública não a lê.
-- ============================================================
create table if not exists public.alunos (
  nome          text        not null check (char_length(nome) between 2 and 30),
  xp            integer     not null default 0 check (xp >= 0),
  dados         jsonb       not null default '{}'::jsonb,
  code_hash     text        not null,          -- sha256(hex) do código normalizado
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ============================================================
-- 2) Índices — lookup por código interno + ordenação do ranking
-- ============================================================

-- Unicidade do código: é o que faz o upsert por code_hash funcionar
create unique index if not exists alunos_code_hash_idx on public.alunos (code_hash);
-- Índice para o ranking (ORDER BY xp DESC)
create        index if not exists alunos_xp_idx  on public.alunos (xp desc);

-- ============================================================
-- 3) RLS — sem policies abertas: só acessível pelas funções
-- ============================================================
alter table public.alunos enable row level security;

-- Grant por coluna: a chave anon lê só nome+xp (para a view ranking).
-- Sem isso a view fica vazia quando security_invoker=true está ligado.
-- Com grant amplo (select *) a chave pública leria dados — EVITAR.
grant select (nome, xp) on public.alunos to anon;

-- ============================================================
-- 4) sync_put — MERGE do progresso
--    Nunca sobrescreve: a lógica de merge (pegar o maior xp,
--    mesclar qStats etc.) é feita no cliente antes de chamar.
-- ============================================================
create or replace function public.sync_put(
  p_code  text,
  p_nome  text,
  p_xp    integer,
  p_dados jsonb
) returns void
language plpgsql security definer set search_path = public, extensions
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

  insert into public.alunos (nome, xp, dados, code_hash)
  values (
    trim(p_nome),
    greatest(coalesce(p_xp, 0), 0),
    coalesce(p_dados, '{}'::jsonb),
    h
  )
  on conflict (code_hash) do update
    set nome          = excluded.nome,
        xp            = excluded.xp,
        dados         = excluded.dados,
        atualizado_em = now();
end;
$$;

-- ============================================================
-- 5) sync_get — lê o snapshot do aluno pelo hash do código
-- ============================================================
create or replace function public.sync_get(p_code text)
returns table (nome text, xp integer, dados jsonb, atualizado_em timestamptz)
language plpgsql security definer set search_path = public, extensions
as $$
declare
  h text;
begin
  if p_code is null or char_length(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')) < 16 then
    return;
  end if;
  h := encode(digest(upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')), 'sha256'), 'hex');

  return query
    select a.nome, a.xp, a.dados, a.atualizado_em
    from public.alunos a
    where a.code_hash = h;
end;
$$;

-- ============================================================
-- 6) sync_delete — direito ao esquecimento (LGPD)
-- ============================================================
create or replace function public.sync_delete(p_code text)
returns void
language plpgsql security definer set search_path = public, extensions
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

-- ============================================================
-- 7) RANKING — só nome + XP + posição. Nunca dados.
--    security_invoker = true: a view executa com os privilégios
--    de quem a lê (anon), não do dono. Sem isso o Supabase Advisor
--    marca "Security Definer View" como Critical — e a view
--    bypassaria o RLS expondo dados e code_hash.
-- ============================================================
create or replace view public.ranking
  with (security_invoker = true) as
  select
    nome,
    xp,
    row_number() over (order by xp desc, nome asc) as posicao
  from public.alunos
  where xp > 0;

-- ============================================================
-- 8) Permissões das RPCs para a chave pública (anon)
-- ============================================================
grant execute on function public.sync_put(text, text, integer, jsonb) to anon;
grant execute on function public.sync_get(text)                       to anon;
grant execute on function public.sync_delete(text)                    to anon;
grant select  on public.ranking                                       to anon;
