-- Builds generales (killer = 'general'): todo el mundo las ve, solo las cuentas de public.admins
-- pueden crearlas o editarlas. Ejecutar una vez en el SQL Editor de Supabase.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "builds_insert" on public.builds;
create policy "builds_insert" on public.builds for insert to authenticated
  with check (user_id = auth.uid() and (killer <> 'general' or public.is_admin()));

drop policy if exists "builds_update" on public.builds;
create policy "builds_update" on public.builds for update to authenticated
  using (user_id = auth.uid() and (killer <> 'general' or public.is_admin()))
  with check (user_id = auth.uid() and (killer <> 'general' or public.is_admin()));

-- Exposed, Late, M1 Slow y M1 Tralleta eran asesinos añadidos para guardar builds generales.
update public.builds set killer = 'general'
  where killer in ('kc-build-m1-slow-9pcp', 'kc-exposeddddddd-ofjz', 'kc-late-sls4', 'kc-m1tralleta-h0m3');
delete from public.killers
  where id in ('kc-build-m1-slow-9pcp', 'kc-exposeddddddd-ofjz', 'kc-late-sls4', 'kc-m1tralleta-h0m3');
