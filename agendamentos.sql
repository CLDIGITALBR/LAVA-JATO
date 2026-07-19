-- =====================================================================
--  LavaSync — Migração: AGENDAMENTOS de lavagem
--  Rode este arquivo UMA vez no Supabase → SQL Editor → New query → Run.
--  É seguro rodar de novo (tudo usa "if not exists" / "drop if exists").
--
--  O que ele faz:
--   1. Cria a coluna de CAPACIDADE por dia em lava_jatos (limite de
--      agendamentos por dia — cada dono define o seu nas Opções).
--   2. Cria a tabela agendamentos (mesma ideia da tabela lavagens).
--   3. Liga o Row Level Security: cada lava-jato só vê os próprios
--      agendamentos (igual ao resto do sistema).
-- =====================================================================


-- 1. CAPACIDADE POR DIA -----------------------------------------------
--    Quantos agendamentos o lava-jato aceita por dia. Padrão: 10.
alter table public.lava_jatos
  add column if not exists agendamentos_por_dia integer default 10;

-- 1b. MARCA NA FILA QUE A LAVAGEM VEIO DE UM AGENDAMENTO ---------------
--     Usado para exibir o selo "Agendado" na fila de espera.
alter table public.lavagens
  add column if not exists de_agendamento boolean default false;


-- 2. TABELA DE AGENDAMENTOS -------------------------------------------
create table if not exists public.agendamentos (
  id                uuid primary key default gen_random_uuid(),
  lava_jato_id      uuid not null references public.lava_jatos(id) on delete cascade,
  data_agendada     date not null,
  hora_agendada     text,                     -- "HH:MM" (opcional)
  nome_cliente      text not null,
  telefone_cliente  text,
  responsavel       text,
  tipo_veiculo      text,
  marca             text,
  modelo            text,
  placa             text,
  servico           text,
  valor_servico     numeric(10,2) default 0,
  observacoes       text,
  status            text default 'agendado'
                    check (status in ('agendado','concluido','cancelado')),
  criado_em         timestamptz default now()
);

-- Consultas rápidas por lava-jato + dia + status (usado pra contar vagas)
create index if not exists idx_agendamentos_tenant_dia
  on public.agendamentos (lava_jato_id, data_agendada, status);


-- 3. ROW LEVEL SECURITY -----------------------------------------------
alter table public.agendamentos enable row level security;

drop policy if exists agendamentos_select on public.agendamentos;
create policy agendamentos_select on public.agendamentos
  for select using (lava_jato_id = public.meu_lava_jato());

drop policy if exists agendamentos_insert on public.agendamentos;
create policy agendamentos_insert on public.agendamentos
  for insert with check (lava_jato_id = public.meu_lava_jato());

drop policy if exists agendamentos_update on public.agendamentos;
create policy agendamentos_update on public.agendamentos
  for update using (lava_jato_id = public.meu_lava_jato())
  with check (lava_jato_id = public.meu_lava_jato());

drop policy if exists agendamentos_delete on public.agendamentos;
create policy agendamentos_delete on public.agendamentos
  for delete using (lava_jato_id = public.meu_lava_jato());


-- 4. PERMITIR O DONO SALVAR A CAPACIDADE (update em lava_jatos) --------
--    (Mesma policy que também cobre o "salvar cor". Só o dono altera.)
drop policy if exists lavajato_update_dono on public.lava_jatos;
create policy lavajato_update_dono on public.lava_jatos
  for update using (id = public.meu_lava_jato() and public.sou_dono())
  with check (id = public.meu_lava_jato() and public.sou_dono());
