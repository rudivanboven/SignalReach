-- Track whether a Website QA Report requester accepted the $45 pricing terms.
-- Existing requests remain null so no historical decision is inferred.

alter table public.qa_report_requests
  add column if not exists pricing_decision text,
  add column if not exists pricing_decision_at timestamptz,
  add column if not exists report_price numeric(10, 2) not null default 45;

alter table public.qa_report_requests
  drop constraint if exists qa_report_requests_pricing_decision_check;

alter table public.qa_report_requests
  add constraint qa_report_requests_pricing_decision_check
  check (pricing_decision is null or pricing_decision in ('agreed', 'declined'));

alter table public.qa_report_requests
  drop constraint if exists qa_report_requests_report_price_check;

alter table public.qa_report_requests
  add constraint qa_report_requests_report_price_check
  check (report_price = 45);

grant insert (
  pricing_decision,
  pricing_decision_at
) on table public.qa_report_requests to anon;

comment on column public.qa_report_requests.pricing_decision is
  'Customer decision on the $45 Website QA Report terms: agreed or declined.';

comment on column public.qa_report_requests.pricing_decision_at is
  'Time the customer explicitly agreed to or declined the $45 terms.';

comment on column public.qa_report_requests.report_price is
  'Website QA Report price presented with the pricing agreement.';
