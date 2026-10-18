create table if not exists public.builds (
  id uuid primary key default gen_random_uuid(),
  killer text not null check (char_length(killer) between 1 and 80),
  name text not null check (char_length(name) between 1 and 80),
  perks text[] not null default '{}' check (cardinality(perks) <= 4 and char_length(array_to_string(perks, '|')) <= 300),
  notes text not null default '' check (char_length(notes) <= 600),
  author text not null check (char_length(author) between 1 and 30),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists builds_killer_idx on public.builds (killer);
create index if not exists builds_user_idx on public.builds (user_id);

alter table public.builds enable row level security;

create policy "builds_select" on public.builds for select to anon, authenticated using (true);
create policy "builds_insert" on public.builds for insert to authenticated with check (user_id = auth.uid());
create policy "builds_update" on public.builds for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "builds_delete" on public.builds for delete to authenticated using (user_id = auth.uid());

create or replace function public.builds_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.builds where user_id = new.user_id) >= 300 then
    raise exception 'limite de builds alcanzado';
  end if;
  return new;
end;
$$;

drop trigger if exists builds_limit on public.builds;
create trigger builds_limit before insert on public.builds for each row execute function public.builds_limit();

alter publication supabase_realtime add table public.builds;
