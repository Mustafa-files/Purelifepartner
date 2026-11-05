-- Welcome email: when a member confirms their email address, call the
-- `welcome-email` Edge Function (which sends via Resend).

create extension if not exists pg_net with schema extensions;

-- One row per member who was sent (or attempted) the welcome email.
-- Service role only: RLS on, no policies.
create table if not exists public.welcome_emails (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  status     text not null default 'sending', -- sending | sent | failed
  resend_id  text,
  error      text,
  created_at timestamptz not null default now(),
  sent_at    timestamptz
);
alter table public.welcome_emails enable row level security;

create or replace function public.send_welcome_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Never let an email problem block the confirmation itself.
  begin
    perform net.http_post(
      url     := 'https://iucizzrqvpsuotatmvrc.supabase.co/functions/v1/welcome-email',
      body    := jsonb_build_object('user_id', new.id),
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  exception when others then
    raise warning 'send_welcome_email failed: %', sqlerrm;
  end;
  return new;
end;
$$;

revoke all on function public.send_welcome_email() from public, anon, authenticated;

drop trigger if exists on_auth_user_email_confirmed on auth.users;
create trigger on_auth_user_email_confirmed
  after update of email_confirmed_at on auth.users
  for each row
  when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.send_welcome_email();
