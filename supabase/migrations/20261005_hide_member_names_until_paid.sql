-- Applied to project iucizzrqvpsuotatmvrc on 2026-10-05 as "hide_member_names_until_paid".
-- Members are identified publicly only by their profile number (shown as PLP-<internal_id>).
-- The User ID handle often contains the real name, so only staff and the owner see it.
create or replace view public.public_profiles as
 SELECT id,
    internal_id,
    CASE
        WHEN id = auth.uid() OR is_staff(auth.uid()) THEN user_id_handle
        ELSE NULL::text
    END AS user_id_handle,
    gender, age, marital_status, height_ft, height_in, height_cm,
    qualification, profession, religion, sect, caste, sub_caste,
    describe_yourself, nationality, residence_country, city, status,
    CASE
        WHEN photo_visibility = 'verified'::text AND NOT (is_verified(auth.uid()) OR is_staff(auth.uid())) THEN NULL::text
        ELSE avatar_url
    END AS avatar_url,
    CASE
        WHEN video_visibility = 'verified'::text AND NOT (is_verified(auth.uid()) OR is_staff(auth.uid())) THEN NULL::text
        ELSE video_url
    END AS video_url,
    created_at,
    CASE
        WHEN photo_visibility = 'verified'::text AND NOT (is_verified(auth.uid()) OR is_staff(auth.uid())) THEN NULL::text[]
        ELSE photos
    END AS photos,
    role
   FROM profiles p
  WHERE role = 'user'::text;

-- The real name is released together with the contact numbers, i.e. only
-- after the viewer has paid (is verified) and the target is verified.
drop function public.get_contact_details(uuid);
create function public.get_contact_details(target uuid)
 returns table(full_name text, father_contact text, mother_contact text, candidate_contact text, whatsapp_no text)
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if not (public.is_verified(auth.uid()) or public.is_staff(auth.uid())) then
    raise exception 'SEARCHER_NOT_VERIFIED';
  end if;
  if not public.is_verified(target) then
    raise exception 'TARGET_NOT_VERIFIED';
  end if;
  insert into public.contact_requests (searcher_id, target_id, status, approved_by)
  values (auth.uid(), target, 'approved', auth.uid());
  return query
    select p.name_private, p.father_contact, p.mother_contact, p.candidate_contact, p.whatsapp_no
    from public.profiles p where p.id = target;
end $function$;

revoke all on function public.get_contact_details(uuid) from public, anon;
grant execute on function public.get_contact_details(uuid) to authenticated, service_role;
