# SubnetLab v2.0 — Ranking e perfis na nuvem

> **Status:** especificação + protótipo. **Não** integrado ao app ainda.
> Decisões fechadas com o Caique (09/11/2026).

## Decisões de produto

| Tema | Decisão |
|---|---|
| Login | **Apenas o nome** (auth anônima). E-mail fica para depois, quando o app estiver mais estruturado — aí vira recuperação de conta |
| Ranking | **Público**: nome + XP, ordenado por XP |
| Escopo atual | Protótipo funcional + esta documentação. Integração ao app **depois** |
| Provedor | **Supabase** (free tier) |

## Por que Supabase

| Critério | Supabase |
|---|---|
| Custo | US$ 0 (free tier permanente) |
| Banco | PostgreSQL (SQL de verdade — ranking é um `ORDER BY`) |
| Auth | Anônima nativa (`signInAnonymously`) — nenhum cadastro para o aluno |
| Privacidade | Row Level Security: cada aluno só lê/escreve o próprio progresso |
| Limites | 500 MB · 50.000 usuários/mês · requisições ilimitadas |
| Integração | `supabase-js` via CDN — funciona no GitHub Pages sem build |

**Dimensionamento:** 55 questões × 100 alunos × ~200 bytes ≈ **1 MB**. O teto de 500 MB atende com folga de duas ordens de grandeza.

## Arquitetura

```
SubnetLab (GitHub Pages, estático)
        │  localStorage = fonte de verdade offline
        │  supabase-js (CDN) quando há rede
        ▼
Supabase
  ├── auth (anônima)         → user_id sem senha
  ├── profiles               → nome, xp
  ├── progresso              → user_id, mod, question_id, acertos, tentativas
  └── ranking (VIEW)         → nome, xp, posicao  (leitura pública)
```

O app continua funcionando **offline**. A sincronização é um "empurrão" oportunista: quando há rede, o que está no `localStorage` sobe para o Supabase.

## Passo a passo do setup (uma vez, ~15 min)

1. Criar conta em https://supabase.com (GitHub login serve).
2. **New project** — nome `subnetlab`, região `South America (São Paulo)`, senha do banco (guarde).
3. Em **SQL Editor**, rodar o script completo abaixo.
4. Em **Authentication → Providers**, habilitar **Anonymous sign-ins**.
5. Em **Project Settings → API**, copiar:
   - `Project URL` → ex. `https://xxxxx.supabase.co`
   - `anon public` key → chave pública (pode ir no frontend; a segurança vem do RLS)

## SQL completo

```sql
-- ─────────────────────────────────────────────────────────────
-- 1. PERFIS (nome + XP). Id = id do usuário anônimo.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text not null check (char_length(nome) between 2 and 30),
  xp         integer not null default 0 check (xp >= 0),
  criado_em  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. PROGRESSO por questão (mesma chave composta do app: mod:id)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.progresso (
  user_id        uuid not null references public.profiles(id) on delete cascade,
  mod            integer not null,
  question_id    integer not null,
  acertos        integer not null default 0,
  tentativas     integer not null default 0,
  atualizado_em  timestamptz not null default now(),
  primary key (user_id, mod, question_id)
);

-- ─────────────────────────────────────────────────────────────
-- 3. RLS — cada usuário só toca no que é seu
-- ─────────────────────────────────────────────────────────────
alter table public.profiles  enable row level security;
alter table public.progresso enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "progresso_all_own" on public.progresso;
create policy "progresso_all_own" on public.progresso
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 4. RANKING — view pública, só nome + XP + posição
--    (nunca expõe o progresso individual)
-- ─────────────────────────────────────────────────────────────
create or replace view public.ranking as
  select
    nome,
    xp,
    row_number() over (order by xp desc, nome asc) as posicao
  from public.profiles
  where xp > 0;

grant select on public.ranking to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- 5. LIMPEZA de perfil (direito ao esquecimento — LGPD)
--    Chamar via RPC:  select public.apagar_meu_perfil();
-- ─────────────────────────────────────────────────────────────
create or replace function public.apagar_meu_perfil()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.profiles where id = auth.uid();  -- cascade apaga progresso
end;
$$;

grant execute on function public.apagar_meu_perfil() to authenticated, anon;
```

## Código de integração (para depois)

```html
<script type="module">
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const sb = createClient('https://SEU-PROJETO.supabase.co', 'SUA_ANON_KEY');

// 1. Entrar (anônimo) — o token fica salvo no navegador
async function entrar(nome) {
  let { data: { session } } = await sb.auth.getSession();
  if (!session) {
    const { data, error } = await sb.auth.signInAnonymously();
    if (error) throw error;
    session = data.session;
  }
  await sb.from('profiles').upsert({
    id: session.user.id,
    nome,
  }, { onConflict: 'id' });
  return session.user.id;
}

// 2. Subir o progresso (uma linha por questão)
async function sincronizar(uid, qStats) {
  const linhas = Object.entries(qStats).map(([chave, v]) => {
    const [mod, question_id] = chave.split(':').map(Number); // "3:12"
    return { user_id: uid, mod, question_id, acertos: v.c, tentativas: v.a };
  });
  if (linhas.length) {
    await sb.from('progresso').upsert(linhas, { onConflict: 'user_id,mod,question_id' });
  }
}

// 3. Ranking
async function ranking() {
  const { data } = await sb.from('ranking').select('*').limit(50);
  return data;
}
</script>
```

## Pontos de atenção (não ignorar)

### 1. Ranking é "de confiança", não "à prova de fraude"
O XP vem do navegador. Um aluno com conhecimento técnico pode forjar a requisição.
Para o contexto de turma, é aceitável. Se um dia precisar de ranking sério, a solução é
uma **Edge Function** que valida as respostas no servidor (o cliente envia só `question_id` +
`answer_index`, e o servidor confere contra o gabarito e calcula o XP).

### 2. LGPD
Nome + progresso é dado pessoal. Obrigatório:
- aviso claro na primeira execução (o que é coletado e por quê);
- botão **"apagar meus dados"** → `select public.apagar_meu_perfil()`;
- como a turma pode ter menores, o aviso deve ser compreensível por eles.

### 3. Offline-first
Nada de bloquear o quiz esperando rede. O `localStorage` manda; o Supabase é espelho.
Fila simples: tentar sincronizar ao abrir o app, ao terminar uma sessão e no evento `online`.

### 4. Free tier pausa por inatividade
Projeto sem uso por ~1 semana é pausado (reativa com 1 clique). Irrelevante com uso de turma.

### 5. Conta anônima não migra de celular
Sem e-mail, trocar de aparelho = perder o perfil. É o trade-off aceito nesta versão.
**v2.1:** adicionar e-mail (magic link) e vincular a conta anônima existente
(`supabase.auth.updateUser({ email })`).

## Roadmap

| Versão | Conteúdo |
|---|---|
| **v1 (atual)** | 100% local, export/import manual |
| **v2.0 (esta spec)** | Perfil por nome, ranking público de XP, sincronização oportunista |
| **v2.1** | E-mail (magic link) + recuperação de conta + migração do perfil anônimo |
| **v2.2** | Ranking por turma (campo `turma` no perfil), filtros |
| **v3** | XP validado no servidor (Edge Function) + estatísticas agregadas da turma |

## Protótipo

`prototype/ranking-demo.html` — página isolada que você abre no navegador, cola a URL e a
anon key do seu projeto Supabase, e testa: entrar com nome, ganhar XP, ver o ranking.
Serve para validar a ideia antes de tocar no app.
