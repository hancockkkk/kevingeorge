create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  email_consent boolean not null default true,
  consent_version text not null,
  consented_at timestamptz not null default now(),
  source text not null default 'website',
  status text not null default 'active'
    check (status in ('active', 'unsubscribed', 'bounced', 'complained')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

revoke all on table public.subscribers from anon, authenticated;
grant all on table public.subscribers to service_role;

comment on table public.subscribers is
  'Email subscribers who explicitly joined through the Kevin George website.';
