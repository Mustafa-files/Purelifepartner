-- Contact request approval: staff approve or reject requests from the admin
-- panel. Approving emails the requester the member's contact details (through
-- the `admin-alert` Edge Function) and unlocks them on the profile page.

alter table public.contact_requests
  add column if not exists approved_at timestamptz;

-- Log a request even before the requester has paid, and never duplicate an
-- open request for the same pair.
create or replace function public.request_contact(target uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare req_id uuid;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  select id into req_id from public.contact_requests
   where searcher_id = auth.uid() and target_id = target and status = 'pending'
   limit 1;
  if req_id is not null then
    return req_id;
  end if;
  insert into public.contact_requests (searcher_id, target_id, status)
  values (auth.uid(), target, 'pending')
  returning id into req_id;
  return req_id;
end $$;

-- Staff decision on a request: approve or reject.
create or replace function public.decide_contact_request(req uuid, approve boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff(auth.uid()) then
    raise exception 'STAFF_ONLY';
  end if;
  update public.contact_requests
     set status      = case when approve then 'approved' else 'rejected' end,
         approved_by = auth.uid(),
         approved_at = case when approve then now() else null end
   where id = req and status = 'pending';
  if not found then
    raise exception 'REQUEST_NOT_PENDING';
  end if;
end $$;

revoke all on function public.decide_contact_request(uuid, boolean) from public, anon;
grant execute on function public.decide_contact_request(uuid, boolean) to authenticated;

-- Contact details unlock when both members are verified (as before), or when
-- staff approved this member's request for this profile.
create or replace function public.get_contact_details(target uuid)
returns table(full_name text, father_contact text, mother_contact text, candidate_contact text, whatsapp_no text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if not exists (
    select 1 from public.contact_requests
     where searcher_id = auth.uid() and target_id = target
       and status = 'approved' and approved_at is not null
  ) then
    if not (public.is_verified(auth.uid()) or public.is_staff(auth.uid())) then
      raise exception 'SEARCHER_NOT_VERIFIED';
    end if;
    if not public.is_verified(target) then
      raise exception 'TARGET_NOT_VERIFIED';
    end if;
    insert into public.contact_requests (searcher_id, target_id, status, approved_by)
    values (auth.uid(), target, 'approved', auth.uid());
  end if;
  return query
    select p.name_private, p.father_contact, p.mother_contact, p.candidate_contact, p.whatsapp_no
    from public.profiles p where p.id = target;
end $$;

-- Email the requester once staff approve.
create or replace function public.send_request_approved_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  begin
    perform net.http_post(
      url     := 'https://iucizzrqvpsuotatmvrc.supabase.co/functions/v1/admin-alert',
      body    := jsonb_build_object('kind', 'request_approved', 'id', new.id),
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  exception when others then
    raise warning 'send_request_approved_email failed: %', sqlerrm;
  end;
  return new;
end;
$$;

revoke all on function public.send_request_approved_email() from public, anon, authenticated;

drop trigger if exists on_contact_request_approved on public.contact_requests;
create trigger on_contact_request_approved
  after update of status on public.contact_requests
  for each row
  when (old.status = 'pending' and new.status = 'approved')
  execute function public.send_request_approved_email();
