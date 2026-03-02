-- Drop the overly permissive update policy
drop policy "Users can update own profile" on public.profiles;

-- Users can update their own profile but cannot change status or email
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and status = (select p.status from public.profiles p where p.id = auth.uid())
    and email = (select p.email from public.profiles p where p.id = auth.uid())
  );
