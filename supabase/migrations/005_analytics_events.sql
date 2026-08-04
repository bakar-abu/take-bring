-- First-party website analytics events (consent-gated from public site)
create extension if not exists "pgcrypto";

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null
    check (event_type in ('page_view', 'cta_click', 'consent')),
  path text not null default '/',
  locale text not null default 'de',
  referrer text not null default '',
  cta_id text not null default '',
  consent_value text not null default '',
  session_id text not null default '',
  visitor_id text not null default '',
  meta jsonb not null default '{}'::jsonb
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);
create index if not exists analytics_events_type_created_idx
  on public.analytics_events (event_type, created_at desc);
create index if not exists analytics_events_path_created_idx
  on public.analytics_events (path, created_at desc);
create index if not exists analytics_events_locale_created_idx
  on public.analytics_events (locale, created_at desc);
create index if not exists analytics_events_session_idx
  on public.analytics_events (session_id);

alter table public.analytics_events enable row level security;
-- No public policies: ingest + reads go through Next.js service role APIs only.
