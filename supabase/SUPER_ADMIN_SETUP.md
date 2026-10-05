# Super Admin setup

The private dashboard lives at `/super-admin` (login at `/super-admin/login`).
It is protected by Supabase Auth **and** a database allow-list — knowing the URL
grants nothing.

## 1. Apply the migration

Run `supabase/migrations/20261005000000_super_admin_access.sql` against the
project, either with the CLI (`supabase db push` after `supabase link`) or by
pasting it into the SQL editor. It is idempotent and does not touch the public
form's anonymous INSERT policy.

It creates:

| Object | Purpose |
| --- | --- |
| `public.admin_users` | Allow-list of auth users (`user_id`, `role = 'super_admin'`). No API writes allowed. |
| `public.is_super_admin()` | `SECURITY DEFINER` check used by RLS and by the Next.js middleware/layouts. |
| `qa_report_requests.admin_notes`, `updated_at` | Internal notes + change timestamp (trigger-maintained). |
| Status check constraint | `new`, `contacted`, `reviewing`, `report_in_progress`, `report_sent`, `completed`. |
| RLS policies | Super admins may `SELECT` everything and `UPDATE` only `status` / `admin_notes`. |

## 2. Create the admin account

1. Supabase Dashboard → **Authentication → Users → Add user**. Enter the email
   and a strong password, tick *Auto confirm user*.
2. Add the user to the allow-list in the SQL editor:

```sql
insert into public.admin_users (user_id, role)
select id, 'super_admin' from auth.users where email = 'admin@yourdomain.com'
on conflict (user_id) do update set role = excluded.role;
```

To revoke access, delete the row from `public.admin_users` (the auth user can
stay but will be denied at login and by RLS).

## 3. Disable public sign-ups

Authentication → **Providers → Email** → turn off *Allow new users to sign up*.
Self-registered accounts would never get admin access, but there is no reason
to allow them at all.

## 4. Environment

Only the public URL and publishable key are required (see `.env.example`).
`NEXT_PUBLIC_CALENDLY_URL` is optional; the "Book Meeting" button is hidden
until a real `https://` URL is supplied.

## What is enforced where

| Layer | Check |
| --- | --- |
| `src/middleware.js` | Every `/super-admin*` request: valid session **and** `is_super_admin()`; otherwise redirect before any rendering. Adds `X-Robots-Tag: noindex`. |
| `app/super-admin/(dashboard)/layout.jsx` | Re-validates session + role server-side on each render. |
| Row Level Security | Even with a forged client, Postgres returns zero rows / permission denied unless the JWT's user is in `admin_users`. |
| Login form | After password sign-in, calls `is_super_admin()`; non-admins are signed out immediately. |

No passwords are stored or displayed anywhere outside Supabase Auth.
