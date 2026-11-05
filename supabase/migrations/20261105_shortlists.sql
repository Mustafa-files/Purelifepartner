-- Members can save profiles to a private shortlist (the heart on each card).
-- Applied to the live project on 2026-11-05.
create table public.shortlists (
  user_id uuid not null references public.profiles(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, profile_id)
);

alter table public.shortlists enable row level security;

create policy shortlists_select_own on public.shortlists
  for select to authenticated using (auth.uid() = user_id);
create policy shortlists_insert_own on public.shortlists
  for insert to authenticated with check (auth.uid() = user_id);
create policy shortlists_delete_own on public.shortlists
  for delete to authenticated using (auth.uid() = user_id);

grant select, insert, delete on public.shortlists to authenticated;
create index shortlists_profile_id_idx on public.shortlists(profile_id);
