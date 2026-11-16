-- ============================================================
-- SubnetLab — certificados por módulo + feed de conquistas
-- Cole este arquivo inteiro no SQL Editor do Supabase e rode.
-- É idempotente: pode rodar de novo sem quebrar nada.
-- ============================================================

-- 1) Certificados: melhor nota por (código de acesso, módulo)
create table if not exists public.certificados (
  code          text        not null,
  mod           int         not null,
  pct           int         not null,
  acertos       int         not null default 0,
  total         int         not null default 0,
  rank          text,
  emitido_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  primary key (code, mod)
);

-- 2) Feed global de conquistas (usado pelas notificações dos colegas)
create table if not exists public.conquistas (
  id        bigserial   primary key,
  code      text        not null,
  nome      text        not null,
  mod       int         not null,
  pct       int         not null,
  rank      text,
  criado_em timestamptz not null default now()
);

create index if not exists conquistas_criado_idx on public.conquistas (criado_em desc);
create index if not exists conquistas_code_idx   on public.conquistas (code);

-- Só as funções acessam as tabelas (RLS ligada, sem policies)
alter table public.certificados enable row level security;
alter table public.conquistas  enable row level security;

-- ============================================================
-- cert_put: grava o certificado APENAS se a nota for melhor.
-- Devolve o melhor aproveitamento e se houve melhora agora.
-- ============================================================
create or replace function public.cert_put(
  p_code    text,
  p_mod     int,
  p_pct     int,
  p_acertos int,
  p_total   int,
  p_rank    text
) returns table (melhor_pct int, melhorou boolean)
language plpgsql security definer set search_path = public as $$
declare
  v_atual  int;
  v_melhor boolean := false;
begin
  if p_code is null or length(trim(p_code)) = 0 then
    raise exception 'codigo obrigatorio';
  end if;
  if p_pct is null or p_pct < 0 or p_pct > 100 then
    raise exception 'pct invalido';
  end if;

  select c.pct into v_atual
    from public.certificados c
   where c.code = p_code and c.mod = p_mod;

  if v_atual is null then
    insert into public.certificados (code, mod, pct, acertos, total, rank)
    values (p_code, p_mod, p_pct, coalesce(p_acertos,0), coalesce(p_total,0), p_rank);
    v_atual  := p_pct;
    v_melhor := true;
  elsif p_pct > v_atual then
    update public.certificados
       set pct = p_pct,
           acertos = coalesce(p_acertos, acertos),
           total   = coalesce(p_total, total),
           rank    = coalesce(p_rank, rank),
           atualizado_em = now()
     where code = p_code and mod = p_mod;
    v_atual  := p_pct;
    v_melhor := true;
  end if;

  return query select v_atual, v_melhor;
end; $$;

-- ============================================================
-- conquista_add: publica no feed (chamado só quando melhorou)
-- ============================================================
create or replace function public.conquista_add(
  p_code text,
  p_nome text,
  p_mod  int,
  p_pct  int,
  p_rank text
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_code is null or length(trim(p_code)) = 0 then
    raise exception 'codigo obrigatorio';
  end if;
  insert into public.conquistas (code, nome, mod, pct, rank)
  values (p_code, coalesce(nullif(trim(p_nome), ''), 'Um colega'), p_mod, p_pct, p_rank);
end; $$;

-- ============================================================
-- conquistas_list: feed para o sino (exclui as do próprio aluno)
-- ============================================================
create or replace function public.conquistas_list(
  p_excluir text,
  p_limite  int default 30
) returns table (
  id bigint, nome text, mod int, pct int, rank text, criado_em timestamptz
)
language sql security definer set search_path = public as $$
  select c.id, c.nome, c.mod, c.pct, c.rank, c.criado_em
    from public.conquistas c
   where c.code <> coalesce(p_excluir, '')
   order by c.criado_em desc
   limit least(coalesce(p_limite, 30), 100);
$$;

-- ============================================================
-- cert_list: certificados de um código (para o perfil)
-- ============================================================
create or replace function public.cert_list(p_code text)
returns table (mod int, pct int, acertos int, total int, rank text, emitido_em timestamptz)
language sql security definer set search_path = public as $$
  select c.mod, c.pct, c.acertos, c.total, c.rank, c.emitido_em
    from public.certificados c
   where c.code = p_code
   order by c.mod;
$$;

-- Permissões para o app (chave pública)
grant execute on function public.cert_put(text,int,int,int,int,text)   to anon, authenticated;
grant execute on function public.conquista_add(text,text,int,int,text) to anon, authenticated;
grant execute on function public.conquistas_list(text,int)             to anon, authenticated;
grant execute on function public.cert_list(text)                       to anon, authenticated;
