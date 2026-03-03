-- Merged "recently shipped" into "what_building" question
alter table public.applications drop column if exists recently_shipped;
