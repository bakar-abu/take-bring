-- Country (IP-derived) + device / browser / OS from User-Agent
alter table public.analytics_events
  add column if not exists country text not null default '',
  add column if not exists device text not null default '',
  add column if not exists browser text not null default '',
  add column if not exists os text not null default '';

create index if not exists analytics_events_country_created_idx
  on public.analytics_events (country, created_at desc)
  where country <> '';
create index if not exists analytics_events_device_created_idx
  on public.analytics_events (device, created_at desc)
  where device <> '';
create index if not exists analytics_events_browser_created_idx
  on public.analytics_events (browser, created_at desc)
  where browser <> '';
