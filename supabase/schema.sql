-- Run once in Supabase SQL Editor. The table stores one shared JSON document.
create table if not exists public.bingo_state (
  id text primary key check (id = 'main'),
  data jsonb not null default '{"rounds":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.bingo_state enable row level security;

-- This is a casual public class board: anyone can read/update the shared board.
-- The anon key is public by design; do not use this policy for sensitive information.
drop policy if exists "Public can read bingo" on public.bingo_state;
drop policy if exists "Public can create bingo" on public.bingo_state;
drop policy if exists "Public can update bingo" on public.bingo_state;

create policy "Public can read bingo" on public.bingo_state
  for select to anon using (true);
create policy "Public can create bingo" on public.bingo_state
  for insert to anon with check (id = 'main');
create policy "Public can update bingo" on public.bingo_state
  for update to anon using (id = 'main') with check (id = 'main');

insert into public.bingo_state (id, data) values ('main', '{"rounds":[]}'::jsonb)
on conflict (id) do nothing;
