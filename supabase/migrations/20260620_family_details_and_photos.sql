-- PureLifePartner schema update (applied to project iucizzrqvpsuotatmvrc)
--   1. family_details: free-text replacement for job_details / income_details
--      (consolidated "Family Details" box on the religion step).
--   2. photos: up to 5 profile photos shown to other members.
--
-- Additive and safe to run more than once.

-- 1. New columns ------------------------------------------------------------
alter table public.profiles
  add column if not exists family_details text;

alter table public.profiles
  add column if not exists photos text[] not null default '{}';

-- 2. Column grants (safe even if table-level grants already cover these) ------
grant select (family_details, photos) on public.profiles to authenticated;
grant update (family_details, photos) on public.profiles to authenticated;

-- 3. public_profiles view -----------------------------------------------------
-- Expose `photos`, nulled for unverified non-staff viewers using the same
-- rule already applied to avatar_url / video_url.
create or replace view public.public_profiles as
 SELECT id,
    internal_id,
    user_id_handle,
    gender,
    age,
    marital_status,
    height_ft,
    height_in,
    height_cm,
    qualification,
    profession,
    religion,
    sect,
    caste,
    sub_caste,
    describe_yourself,
    nationality,
    residence_country,
    city,
    status,
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
        END AS photos
   FROM profiles p
  WHERE role = 'user'::text;
