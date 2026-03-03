-- Add new application questions
alter table public.applications add column if not exists recently_shipped text;
alter table public.applications add column if not exists contribution text;
