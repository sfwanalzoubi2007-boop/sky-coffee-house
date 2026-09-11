-- SKY Coffee House: shared ordering + table sessions
-- Run ONCE in Supabase SQL Editor, then add URL/key to js/supabase-config.js.

create extension if not exists pgcrypto;

create table if not exists public.table_sessions (
  id uuid primary key default gen_random_uuid(),
  table_number integer not null,
  session_token text not null unique,
  status text not null default 'open' check (status in ('open','closed')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz
);
create unique index if not exists one_open_session_per_table on public.table_sessions(table_number) where status='open';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint not null,
  table_number integer not null,
  session_id uuid references public.table_sessions(id),
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10,2) not null default 0,
  vat numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  instructions text,
  status text not null default 'received' check (status in ('received','preparing','ready','served')),
  created_at timestamptz not null default now()
);
alter table public.orders add column if not exists session_id uuid references public.table_sessions(id);
create index if not exists orders_status_created_idx on public.orders(status, created_at);
create index if not exists orders_session_id_idx on public.orders(session_id);

create table if not exists public.waiter_calls (
  id uuid primary key default gen_random_uuid(),
  table_number integer not null,
  status text not null default 'pending' check (status in ('pending','resolved')),
  created_at timestamptz not null default now()
);

alter table public.orders replica identity full;
alter table public.table_sessions replica identity full;
alter table public.waiter_calls replica identity full;

do $$
begin
  begin alter publication supabase_realtime add table public.orders; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.table_sessions; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.waiter_calls; exception when duplicate_object then null; end;
end $$;

-- Initial functional policies. These allow the public QR page to submit orders
-- and the kitchen page to read/update them. For production, replace these with
-- Supabase Auth + staff-only policies.
alter table public.orders enable row level security;
alter table public.table_sessions enable row level security;
alter table public.waiter_calls enable row level security;

drop policy if exists sky_insert_orders on public.orders;
create policy sky_insert_orders on public.orders for insert to anon, authenticated with check (true);
drop policy if exists sky_read_orders on public.orders;
create policy sky_read_orders on public.orders for select to anon, authenticated using (true);
drop policy if exists sky_update_orders on public.orders;
create policy sky_update_orders on public.orders for update to anon, authenticated using (true) with check (true);

drop policy if exists sky_read_sessions on public.table_sessions;
create policy sky_read_sessions on public.table_sessions for select to anon, authenticated using (true);
drop policy if exists sky_insert_sessions on public.table_sessions;
create policy sky_insert_sessions on public.table_sessions for insert to anon, authenticated with check (true);
drop policy if exists sky_update_sessions on public.table_sessions;
create policy sky_update_sessions on public.table_sessions for update to anon, authenticated using (true) with check (true);

drop policy if exists sky_insert_waiter_calls on public.waiter_calls;
create policy sky_insert_waiter_calls on public.waiter_calls for insert to anon, authenticated with check (true);
drop policy if exists sky_read_waiter_calls on public.waiter_calls;
create policy sky_read_waiter_calls on public.waiter_calls for select to anon, authenticated using (true);
drop policy if exists sky_update_waiter_calls on public.waiter_calls;
create policy sky_update_waiter_calls on public.waiter_calls for update to anon, authenticated using (true) with check (true);
