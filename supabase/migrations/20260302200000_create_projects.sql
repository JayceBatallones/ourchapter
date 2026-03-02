-- Projects table (things members are building)
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  url text,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- Anyone can view projects belonging to approved profiles
create policy "Projects of approved profiles are viewable by everyone"
  on public.projects for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = projects.profile_id
        and profiles.status = 'approved'
    )
  );

-- Users can view their own projects regardless of profile status
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = profile_id);

-- Users can insert their own projects
create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = profile_id);

-- Users can update their own projects
create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = profile_id);

-- Users can delete their own projects
create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = profile_id);
