-- =========================================================================
-- CVAscender database — run once in Supabase > SQL Editor.
-- Safe to re-run: it drops and recreates the policies.
-- =========================================================================

-- One row per student. `data` holds the profile, tracker and CV entries as
-- AES-256-GCM ciphertext ("enc:v1:...") produced by the server, so the
-- database never sees readable student data when DATA_ENCRYPTION_KEY is set.
create table if not exists public.student_data (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data       text not null check (char_length(data) <= 200000),
  updated_at timestamptz not null default now()
);

-- Row Level Security: ON, and FORCED (applies even to the table owner).
alter table public.student_data enable row level security;
alter table public.student_data force row level security;

-- Anonymous visitors get no access at all; signed-in users only to their row.
revoke all on public.student_data from anon;
revoke all on public.student_data from public;
grant select, insert, update, delete on public.student_data to authenticated;

drop policy if exists "read own data"   on public.student_data;
drop policy if exists "insert own data" on public.student_data;
drop policy if exists "update own data" on public.student_data;
drop policy if exists "delete own data" on public.student_data;

create policy "read own data"   on public.student_data for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own data" on public.student_data for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own data" on public.student_data for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own data" on public.student_data for delete to authenticated using ((select auth.uid()) = user_id);

-- Block field tampering: nobody can move a row to another user, and the
-- timestamp is always set by the database, not by the client.
create or replace function public.student_data_guard() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and new.user_id is distinct from old.user_id then
    raise exception 'user_id cannot be changed';
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists student_data_guard on public.student_data;
create trigger student_data_guard before insert or update on public.student_data
  for each row execute function public.student_data_guard();

-- Optional, for later: listings table. Public can READ; nobody can write
-- through the API (add listings from the dashboard or a trusted admin tool).
create table if not exists public.opportunities (
  id          text primary key check (id ~ '^[a-z0-9-]{1,64}$'),
  data        jsonb not null check (pg_column_size(data) <= 20000),
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table public.opportunities enable row level security;
alter table public.opportunities force row level security;
revoke insert, update, delete on public.opportunities from anon, authenticated;
drop policy if exists "anyone can read listings" on public.opportunities;
create policy "anyone can read listings" on public.opportunities for select to anon, authenticated using (true);
