-- Add social media link columns to profiles
alter table public.profiles
  add column linkedin text,
  add column github text,
  add column instagram text,
  add column youtube text,
  add column tiktok text;
