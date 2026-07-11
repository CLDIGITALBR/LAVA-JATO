-- =====================================================================
--  LavaSync — Banco de dados (Supabase / PostgreSQL)
--  Arquitetura MULTI-TENANT: um banco atende vários lava-jatos.
--  Cada cliente só enxerga os próprios dados (Row Level Security).
--
--  COMO USAR:
--  1. Supabase → seu projeto → SQL Editor → New query
--  2. Cole TODO este arquivo e clique em "Run"
-- =====================================================================


-- =====================================================================
--  1. TABELAS
-- =====================================================================

-- Cada lava-jato é um "tenant" (cliente da CL Digital)
create table if not exists public.lava_jatos (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null,
  logo_url       text,
  cor_primaria   text default '#1976D2',   -- personalização por cliente
  telefone       text,
  criado_em      timestamptz default now()
);

-- Liga o usuário de login (auth.users do Supabase) ao seu lava-jato
create table if not exists public.perfis (
  id            uuid primary key references auth.users(id) on delete cascade,
  lava_jato_id  uuid references public.lava_jatos(id) on delete cascade,
  nome          text,
  papel         text default 'atendente' check (papel in ('dono','atendente')),
  criado_em     timestamptz default now()
);

-- As lavagens (fila + histórico), sempre amarradas a um lava-jato
create table if not exists public.lavagens (
  id                uuid primary key default gen_random_uuid(),
  lava_jato_id      uuid not null references public.lava_jatos(id) on delete cascade,
  data_entrada      date,
  nome_cliente      text not null,
  telefone_cliente  text,
  responsavel       text,
  tipo_veiculo      text,
  marca             text,
  modelo            text,
  placa             text,
  servico           text,
  valor_servico     numeric(10,2) default 0,
  status            text default 'fila' check (status in ('fila','concluida')),
  criado_em         timestamptz default now(),
  concluido_em      timestamptz
);

-- Índice pra consultas rápidas por lava-jato + status
create index if not exists idx_lavagens_tenant_status
  on public.lavagens (lava_jato_id, status);


-- =====================================================================
--  2. FUNÇÃO AUXILIAR
--  Retorna o lava_jato_id do usuário logado.
--  SECURITY DEFINER evita recursão de RLS e deixa as policies limpas.
-- =====================================================================

create or replace function public.meu_lava_jato()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select lava_jato_id from public.perfis where id = auth.uid();
$$;


-- =====================================================================
--  3. ROW LEVEL SECURITY (o coração da segurança multi-tenant)
--  Sem isso, a anon key exporia os dados de todos. COM isso,
--  cada usuário só acessa o próprio lava-jato.
-- =====================================================================

alter table public.lava_jatos enable row level security;
alter table public.perfis     enable row level security;
alter table public.lavagens   enable row level security;

-- PERFIS: o usuário só vê o próprio perfil
drop policy if exists perfil_proprio on public.perfis;
create policy perfil_proprio on public.perfis
  for select using (id = auth.uid());

-- LAVA_JATOS: o usuário só vê o lava-jato ao qual pertence
drop policy if exists lavajato_do_usuario on public.lava_jatos;
create policy lavajato_do_usuario on public.lava_jatos
  for select using (id = public.meu_lava_jato());

-- LAVAGENS: leitura, inserção, edição e remoção só do próprio lava-jato
drop policy if exists lavagens_select on public.lavagens;
create policy lavagens_select on public.lavagens
  for select using (lava_jato_id = public.meu_lava_jato());

drop policy if exists lavagens_insert on public.lavagens;
create policy lavagens_insert on public.lavagens
  for insert with check (lava_jato_id = public.meu_lava_jato());

drop policy if exists lavagens_update on public.lavagens;
create policy lavagens_update on public.lavagens
  for update using (lava_jato_id = public.meu_lava_jato());

drop policy if exists lavagens_delete on public.lavagens;
create policy lavagens_delete on public.lavagens
  for delete using (lava_jato_id = public.meu_lava_jato());


-- =====================================================================
--  4. COMO CADASTRAR UM NOVO LAVA-JATO (você, CL Digital, faz isso)
--  Enquanto são poucos clientes, o cadastro manual é o mais simples.
--
--  PASSO A: crie o usuário de login
--    Supabase → Authentication → Users → "Add user"
--    (defina email + senha e copie o UID gerado)
--
--  PASSO B: rode o bloco abaixo trocando os valores.
--    Ele cria o lava-jato e liga o usuário a ele.
-- =====================================================================

-- Exemplo (descomente e ajuste):
--
-- with novo as (
--   insert into public.lava_jatos (nome, telefone, cor_primaria)
--   values ('Lava-Jato do Zé', '11999998888', '#1976D2')
--   returning id
-- )
-- insert into public.perfis (id, lava_jato_id, nome, papel)
-- select 'COLE_O_UID_DO_USUARIO_AQUI'::uuid, novo.id, 'Zé', 'dono'
-- from novo;
