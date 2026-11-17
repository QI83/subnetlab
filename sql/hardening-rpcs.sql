-- ============================================================
-- SubnetLab — endurecimento das RPCs públicas
-- Rode este arquivo inteiro no SQL Editor do Supabase. É idempotente.
--
-- Contexto: a chave publicável fica no JS do app, então qualquer pessoa
-- pode chamar as RPCs. Antes desta correção era possível:
--   • sync_put com xp = 999999  → primeiro lugar no ranking em 10 segundos
--   • conquista_add com pct = 999 → conquista falsa no sino de todo mundo
--
-- O que NÃO dá para fazer sem login: provar que o XP é legítimo. Isto aqui
-- eleva o custo da fraude (XP passa a ter que ser compatível com as respostas
-- registradas) e torna a fraude visível no banco — não a impede por completo.
-- ============================================================

-- ============================================================
-- 1) sync_put — XP plausível, nunca regride
--    Mantém a normalização atual do código (maiúsculas, sem pontuação),
--    o hash SHA-256 em code_hash e o upsert por code_hash.
-- ============================================================
create or replace function public.sync_put(
  p_code  text,
  p_nome  text,
  p_xp    integer,
  p_dados jsonb
) returns void
language plpgsql security definer set search_path = 'public', 'extensions'
as $function$
declare
  h       text;
  v_tent  integer;
  v_teto  integer;
  v_xp    integer;
begin
  if p_code is null or char_length(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')) < 16 then
    raise exception 'codigo_invalido';
  end if;
  if p_nome is null or char_length(trim(p_nome)) < 2 then
    raise exception 'nome_invalido';
  end if;

  h := encode(digest(upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')), 'sha256'), 'hex');

  -- Teto de XP derivado do próprio progresso: cada resposta registrada em
  -- qStats vale no máximo 25 XP (15 base + 10 de sequência). Damos 25 por
  -- resposta, mais 200 de folga, e um teto absoluto de 100k. A folga é
  -- pequena de propósito: com 1000 de folga, quem não respondeu nada ainda
  -- entrava no ranking com 1000 XP — o suficiente para liderar turma nova.
  select coalesce(sum(
           case when (e.val ->> 'a') ~ '^[0-9]+$' then (e.val ->> 'a')::int else 0 end
         ), 0)
    into v_tent
    from jsonb_each(coalesce(p_dados -> 'qStats', '{}'::jsonb)) as e(k, val);

  v_teto := least(200 + 25 * v_tent, 100000);
  v_xp   := least(greatest(coalesce(p_xp, 0), 0), v_teto);

  insert into public.alunos (code_hash, nome, xp, dados)
  values (h, trim(p_nome), v_xp, coalesce(p_dados, '{}'::jsonb))
  on conflict (code_hash) do update
    set nome          = excluded.nome,
        -- XP nunca regride: o merge é sempre "o maior vence"
        xp            = greatest(excluded.xp, public.alunos.xp),
        dados         = excluded.dados,
        atualizado_em = now();
end;
$function$;

-- ============================================================
-- 2) conquista_add — valida o que entra no feed do sino
--    Mantém `code` como enviado (a lista é comparada pelo código literal,
--    igual a conquistas_list faz hoje). Trocar para hash exigiria mudar
--    também conquistas_list e migrar as linhas existentes — ver nota no fim.
-- ============================================================
create or replace function public.conquista_add(
  p_code text,
  p_nome text,
  p_mod  integer,
  p_pct  integer,
  p_rank text
) returns void
language plpgsql security definer set search_path to 'public'
as $function$
begin
  if p_code is null or length(trim(p_code)) = 0 then
    raise exception 'codigo obrigatorio';
  end if;

  -- Só existe certificado com nota 0–100, em módulo 0–4, com estes 4 ranks
  if p_pct is null or p_pct < 0 or p_pct > 100 then
    raise exception 'pct invalido';
  end if;
  if p_mod is null or p_mod < 0 or p_mod > 4 then
    raise exception 'mod invalido';
  end if;
  if p_rank is null or p_rank not in (
       'Mestre CCNA', 'Expert em Redes', 'CCNA Aprovado', 'Técnico de Redes'
     ) then
    raise exception 'rank invalido';
  end if;

  insert into public.conquistas (code, nome, mod, pct, rank)
  values (
    p_code,
    left(coalesce(nullif(trim(p_nome), ''), 'Um colega'), 30),
    p_mod, p_pct, p_rank
  );
end;
$function$;

-- ============================================================
-- 3) Conferência rápida (opcional): rode depois para ver o efeito
-- ============================================================
-- Deve gravar 200 (teto de quem não tem resposta registrada) e não estourar:
--   select public.sync_put('ZZZZ-ZZZZ-ZZZZ-ZZZZ', 'Teste Teto', 999999, '{}'::jsonb);
--   select xp from public.alunos where nome = 'Teste Teto';   -- espera 200
-- Deve falhar com "pct invalido":
--   select public.conquista_add('ZZZZ-ZZZZ-ZZZZ-ZZZZ', 'Teste', 3, 999, 'Mestre CCNA');
-- Limpeza do teste:
--   delete from public.alunos   where nome = 'Teste Teto';
--
-- ============================================================
-- Nota — próxima etapa (não inclusa aqui)
-- `conquistas.code` guarda o código de acesso EM CLARO. Trocar por hash
-- exige alterar também `conquistas_list` (que compara p_excluir com o valor
-- da coluna) e migrar as linhas antigas. Fica para quando dermos acesso ao
-- painel do professor; hoje a tabela não é legível pela chave pública.
-- ============================================================
