-- Public form submissions for the "Get Your Free QA Report" form.
-- Anonymous clients can submit form fields only; private records cannot be read.

create table if not exists public.qa_report_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  website_url text not null,
  industry text not null,
  industry_other text,
  service_needed text not null,
  service_other text,
  check_items text[],
  check_other text,
  details text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.qa_report_requests enable row level security;

-- Remove broad/default access before granting the minimum needed by the form.
revoke all on table public.qa_report_requests from public;
revoke all on table public.qa_report_requests from anon;
revoke all on table public.qa_report_requests from authenticated;

-- Anonymous callers may supply only public form fields. Server-controlled fields
-- (id, status, and created_at) always use their database defaults.
grant insert (
  first_name,
  last_name,
  email,
  phone,
  website_url,
  industry,
  industry_other,
  service_needed,
  service_other,
  check_items,
  check_other,
  details
) on table public.qa_report_requests to anon;

drop policy if exists "anon_can_submit_qa_report_requests"
  on public.qa_report_requests;

create policy "anon_can_submit_qa_report_requests"
  on public.qa_report_requests
  for insert
  to anon
  with check (true);

comment on table public.qa_report_requests is
  'Private QA report requests submitted through the public SignalReach form.';

