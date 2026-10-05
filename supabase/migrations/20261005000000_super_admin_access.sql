-- Super Admin access for the private /super-admin dashboard.
--
-- What this migration does
--   1. Creates public.admin_users — the allow-list of auth users who may open the
--      dashboard. Only rows with role = 'super_admin' grant access.
--   2. Creates public.is_super_admin() — a SECURITY DEFINER helper used by both
--      RLS policies and the Next.js server/middleware checks.
--   3. Adds admin-only columns to public.qa_report_requests
--      (admin_notes, updated_at) and a status constraint.
--   4. Grants super admins SELECT + limited UPDATE on qa_report_requests through
--      column-level grants and RLS policies.
--
-- What this migration deliberately does NOT do
--   * It does not touch the existing anonymous INSERT grant/policy
--     ("anon_can_submit_qa_report_requests") — the public form keeps working.
--   * It does not grant anon or authenticated any DELETE on qa_report_requests.
--   * It never stores passwords. Credentials live only in Supabase Auth.
--
-- Adding an admin (run in the SQL editor AFTER creating the user in
-- Authentication → Users):
--
--   insert into public.admin_users (user_id, role)
--   select id, 'super_admin' from auth.users where email = 'admin@yourdomain.com'
--   on conflict (user_id) do update set role = excluded.role;
--
-- Also disable public sign-ups in Authentication → Providers → Email so nobody
-- can self-register an (un-privileged) account.

-- -----------------------------------------------------------------------------
-- 1. admin_users allow-list
-- -----------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  role text not null default 'super_admin'
    constraint admin_users_role_check check (role in ('super_admin')),
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Allow-list of Supabase Auth users permitted to use the SignalReach Super Admin dashboard.';

alter table public.admin_users enable row level security;

-- Nobody writes to this table through the API. Rows are managed by the project
-- owner in the SQL editor / dashboard (service role bypasses RLS).
revoke all on table public.admin_users from public;
revoke all on table public.admin_users from anon;
revoke all on table public.admin_users from authenticated;

-- A signed-in user may read ONLY their own allow-list row (useful for the UI;
-- authorization itself goes through is_super_admin()).
grant select on table public.admin_users to authenticated;

drop policy if exists "admin_users_read_own_row" on public.admin_users;
create policy "admin_users_read_own_row"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- -----------------------------------------------------------------------------
-- 2. is_super_admin() helper
-- -----------------------------------------------------------------------------
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.role = 'super_admin'
  );
$$;

comment on function public.is_super_admin() is
  'True when the current JWT belongs to a user listed in admin_users with role super_admin.';

revoke all on function public.is_super_admin() from public;
revoke all on function public.is_super_admin() from anon;
grant execute on function public.is_super_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- 3. Admin-only columns + status workflow on qa_report_requests
-- -----------------------------------------------------------------------------
alter table public.qa_report_requests
  add column if not exists admin_notes text,
  add column if not exists updated_at timestamptz not null default now();

comment on column public.qa_report_requests.admin_notes is
  'Internal notes written by super admins. Never shown on the public website.';

-- Allowed workflow statuses. Added NOT VALID so the migration can never fail on
-- legacy rows; it is still enforced for every new insert/update.
alter table public.qa_report_requests
  drop constraint if exists qa_report_requests_status_check;

alter table public.qa_report_requests
  add constraint qa_report_requests_status_check
  check (status in ('new', 'contacted', 'reviewing', 'report_in_progress', 'report_sent', 'completed'))
  not valid;

-- Keep updated_at honest on every admin update.
create or replace function public.set_qa_report_requests_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists qa_report_requests_set_updated_at on public.qa_report_requests;
create trigger qa_report_requests_set_updated_at
  before update on public.qa_report_requests
  for each row
  execute function public.set_qa_report_requests_updated_at();

-- -----------------------------------------------------------------------------
-- 4. Super admin read / update access (RLS)
-- -----------------------------------------------------------------------------
-- Column-level grants: admins can read everything, but may only change the
-- workflow fields. Submission data itself stays immutable through the API.
grant select on table public.qa_report_requests to authenticated;
grant update (status, admin_notes) on table public.qa_report_requests to authenticated;

drop policy if exists "super_admin_can_read_qa_report_requests" on public.qa_report_requests;
create policy "super_admin_can_read_qa_report_requests"
  on public.qa_report_requests
  for select
  to authenticated
  using ((select public.is_super_admin()));

drop policy if exists "super_admin_can_update_qa_report_requests" on public.qa_report_requests;
create policy "super_admin_can_update_qa_report_requests"
  on public.qa_report_requests
  for update
  to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));

-- Helpful index for the dashboard's default "newest first" ordering and filters.
create index if not exists qa_report_requests_created_at_idx
  on public.qa_report_requests (created_at desc);

create index if not exists qa_report_requests_status_idx
  on public.qa_report_requests (status);
