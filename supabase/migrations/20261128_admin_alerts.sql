-- Admin email alerts: when someone creates an account or requests a member's
-- contact details, call the `admin-alert` Edge Function (which emails the
-- owners via Resend).

create extension if not exists pg_net with schema extensions;

-- One row per alert sent (or attempted). Service role only: RLS on, no policies.
create table if not exists public.admin_alerts (
  kind       text not null, -- new_account | contact_request
  ref_id     uuid not null, -- profiles.id or contact_requests.id
  status     text not null default 'sending', -- sending | sent | failed
  resend_id  text,
  error      text,
  created_at timestamptz not null default now(),
  sent_at    timestamptz,
  primary key (kind, ref_id)
);
alter table public.admin_alerts enable row level security;

create or replace function public.send_admin_alert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Never let an email problem block the sign up or the request itself.
  begin
    perform net.http_post(
      url     := 'https://iucizzrqvpsuotatmvrc.supabase.co/functions/v1/admin-alert',
      body    := jsonb_build_object('kind', tg_argv[0], 'id', new.id),
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  exception when others then
    raise warning 'send_admin_alert failed: %', sqlerrm;
  end;
  return new;
end;
$$;

revoke all on function public.send_admin_alert() from public, anon, authenticated;

drop trigger if exists on_profile_created_alert on public.profiles;
create trigger on_profile_created_alert
  after insert on public.profiles
  for each row
  execute function public.send_admin_alert('new_account');

drop trigger if exists on_contact_request_alert on public.contact_requests;
create trigger on_contact_request_alert
  after insert on public.contact_requests
  for each row
  execute function public.send_admin_alert('contact_request');
