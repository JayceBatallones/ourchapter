-- Add location column to profiles
alter table public.profiles add column if not exists location text;

-- Applications table (private application responses)
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade unique not null,
  what_building text,
  link_url text,
  referral_source text,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.applications enable row level security;

-- Users can insert their own application
create policy "Users can insert own application"
  on public.applications for insert
  with check (auth.uid() = profile_id);

-- Users can read their own application
create policy "Users can read own application"
  on public.applications for select
  using (auth.uid() = profile_id);

-- Users can update their own application
create policy "Users can update own application"
  on public.applications for update
  using (auth.uid() = profile_id);
