-- Blog CMS tables (dashboard + public site)
create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'blog_status' and n.nspname = 'public'
  ) then
    create type public.blog_status as enum ('DRAFT', 'PUBLISHED');
  end if;
end
$$;

create table if not exists public.blog_image_assets (
  id uuid primary key default gen_random_uuid(),
  original_file_name text not null,
  mime_type text not null default 'image/webp',
  storage_path text not null unique,
  public_url text not null,
  width integer,
  height integer,
  size_bytes integer not null default 0,
  file_data bytea,
  alt_text text,
  uploaded_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists blog_image_assets_created_at_idx
  on public.blog_image_assets (created_at desc);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  status public.blog_status not null default 'DRAFT',
  seo_title text not null default '',
  seo_description text not null default '',
  category text not null default '',
  date_label text not null default '',
  body_html text not null default '',
  cover_image_url text not null default '',
  cover_image_asset_id uuid references public.blog_image_assets (id) on delete set null,
  views_count integer not null default 0,
  author_id uuid references public.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blogs_status_idx on public.blogs (status);
create index if not exists blogs_created_at_idx on public.blogs (created_at desc);
create index if not exists blogs_author_id_idx on public.blogs (author_id);
create index if not exists blogs_cover_image_asset_id_idx on public.blogs (cover_image_asset_id);

create or replace function public.set_blogs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
before update on public.blogs
for each row execute function public.set_blogs_updated_at();

alter table public.blog_image_assets enable row level security;
alter table public.blogs enable row level security;
-- No public policies: Next.js APIs use the service role key / DATABASE_URL only.
