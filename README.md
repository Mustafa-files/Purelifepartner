# PureLifePartner

A halal Muslim matrimonial web application built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4, and Supabase.

## Running the app

```powershell
npm install
npm run dev      # development at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Supabase credentials live in `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Deploying to Cloudflare Pages

The app is configured for dynamic Cloudflare Pages deployment via `@cloudflare/next-on-pages` and `wrangler.json`. The dynamic `/profile/[id]` route runs on the Edge runtime (set in `app/profile/[id]/layout.tsx`), which Pages requires.

In the Cloudflare Pages dashboard (Workers & Pages > Create > Pages > connect the repo):

- Build command: `npx @cloudflare/next-on-pages`
- Build output directory: `.vercel/output/static`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- The `nodejs_compat` compatibility flag is set in `wrangler.json`; if configuring manually in the dashboard, add it under Settings > Functions > Compatibility flags.

CLI alternative once `wrangler login` is done:

```powershell
npm run pages:build     # builds via next-on-pages (run on Linux/CI; unreliable on Windows)
npm run pages:deploy    # uploads .vercel/output/static per wrangler.json
```

Note: `next-on-pages` shells out to the Vercel CLI, which is officially unreliable on Windows. Run the Pages build in Cloudflare CI, WSL, or any Linux environment; local Windows `npm run dev`/`build`/`start` are unaffected.

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing page (hero, how it works, features, testimonials, stats, CTA) |
| `/register` | Step 1: login details (gender, DOB with 16-35 validation, email, WhatsApp, unique User ID, password) |
| `/register/personal` | Step 2: name (office only), marital status, height ft/in and cm auto-convert, education, profession |
| `/register/religion` | Step 3: religion, sect, caste, sub caste, describe yourself, document verification upload, job and income |
| `/register/residence` | Step 4: nationality, country, dynamic cities, residence type, size, story |
| `/register/family` | Step 5: parents, brothers and sisters with per-sibling descriptions |
| `/register/requirements` | Step 6: partner preferences (age sliders 16-35, region, country, city cascades, All-X options) |
| `/register/contact` | Step 7: father, mother and candidate contact numbers |
| `/register/agent` | Agent application with bank details |
| `/login` | Email and password sign in plus password reset |
| `/dashboard` | Member dashboard: status, avatar and video upload, profile completion |
| `/search` | Public profile search with the full filter panel |
| `/profile/[id]` | Profile view with the gated "View Contact Details" flow |
| `/payment` | Multi-currency verification payment (PKR, GBP, EUR, USD) |
| `/admin` | Admin: users, agents, payments, dropdown values, WhatsApp log, notes, bank accounts |
| `/system` | System users: edit any profile, office notes |
| `/success-stories` | Success stories |

## Roles and security

Roles (`user`, `agent`, `system`, `admin`) are stored on `profiles.role` and enforced by Postgres Row Level Security. Key design points:

- Anonymous visitors browse via the `public_profiles` view, which exposes only safe columns. Contact numbers and the real name never leave the database for non-staff.
- Photos and videos are hidden from unverified viewers (the view nulls `avatar_url`/`video_url` for them).
- `get_contact_details(target)` releases phone numbers only when BOTH parties are Verified; otherwise the UI redirects to `/payment` or files a pending `contact_requests` row for agent follow-up.
- The `internal_id` sequence starts at 100101 and auto-increments.
- "Others" values for caste, sub caste, sect, religion, profession and qualification are saved to `dynamic_values` for admin approval.

### Bootstrapping the first admin

New signups default to the `user` role. Promote your account in the Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## Remaining integrations (TODO)

1. **Stripe**: `/payment` currently records bank transfers for manual admin confirmation. Add a Checkout Session API route plus webhook, then flip `payments.status` and `profiles.status` from the webhook handler (see TODO comment in `app/payment/page.tsx`).
2. **WhatsApp inbound webhook**: outbound messages are logged to `whatsapp_logs` when admins confirm payments. For inbound replies, register a WhatsApp Business API webhook pointing at a Supabase Edge Function that inserts rows with `direction = 'inbound'` (see TODO in `app/admin/page.tsx`).
3. **AI document verification**: uploads land in the private `documents` bucket and set `doc_verification_status = 'pending_review'` for manual agent review. Wire an Edge Function to OCR and match Name and DOB, and delete documents after verification.
4. **Auth user deletion**: deleting a profile in `/admin` removes the profile row; removing the `auth.users` login requires a service-role Edge Function.
5. **Email confirmation**: if "Confirm email" is enabled in Supabase Auth settings, users confirm before continuing to Step 2 (the UI handles both modes).
