-- Run this in Supabase SQL Editor before running scripts/migrate-to-supabase.ts

create extension if not exists pgcrypto;

create table if not exists public.quiz_sets (
  id text primary key default gen_random_uuid()::text,
  mode text not null check (mode in ('jft-mockup', 'kisi-kisi')),
  name text not null,
  description text,
  level text,
  file_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id text primary key,
  quiz_set_id text not null references public.quiz_sets(id) on delete cascade,
  number integer not null,
  section text not null,
  prompt text not null,
  answer_id text not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quiz_set_id, number)
);

create table if not exists public.quiz_options (
  id bigint generated always as identity unique,
  question_id text not null references public.quiz_questions(id) on delete cascade,
  choice_id text not null,
  text text not null,
  image_url text,
  order_index integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (question_id, choice_id)
);

create table if not exists public.quiz_assets (
  question_id text not null references public.quiz_questions(id) on delete cascade,
  asset_type text not null,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (question_id, asset_type, url)
);

create table if not exists public.user_progress (
  quiz_id text not null,
  user_id text not null,
  mode text not null check (mode in ('jft-mockup', 'kisi-kisi')),
  file_name text not null,
  current_index integer not null default 0,
  answers jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (quiz_id, user_id)
);

create table if not exists public.quiz_results (
  id bigint generated always as identity primary key,
  quiz_id text not null,
  user_id text not null,
  mode text not null check (mode in ('jft-mockup', 'kisi-kisi')),
  file_name text not null,
  score integer not null,
  correct integer not null,
  total integer not null,
  answers jsonb not null default '[]'::jsonb,
  section_scores jsonb,
  completed_at timestamptz not null default now()
);

create index if not exists idx_quiz_questions_quiz_set_id on public.quiz_questions (quiz_set_id);
create index if not exists idx_quiz_options_question_id on public.quiz_options (question_id);
create index if not exists idx_quiz_assets_question_id on public.quiz_assets (question_id);
create index if not exists idx_quiz_results_user_completed on public.quiz_results (user_id, completed_at desc);

-- RLS
alter table public.quiz_sets enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.quiz_assets enable row level security;
alter table public.user_progress enable row level security;
alter table public.quiz_results enable row level security;

-- Public read access for quiz content
drop policy if exists "quiz_sets_read_public" on public.quiz_sets;
create policy "quiz_sets_read_public"
  on public.quiz_sets
  for select
  to anon, authenticated
  using (true);

drop policy if exists "quiz_sets_insert_admin_client" on public.quiz_sets;
create policy "quiz_sets_insert_admin_client"
  on public.quiz_sets
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "quiz_sets_update_admin_client" on public.quiz_sets;
create policy "quiz_sets_update_admin_client"
  on public.quiz_sets
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "quiz_sets_delete_admin_client" on public.quiz_sets;
create policy "quiz_sets_delete_admin_client"
  on public.quiz_sets
  for delete
  to anon, authenticated
  using (true);

drop policy if exists "quiz_questions_read_public" on public.quiz_questions;
create policy "quiz_questions_read_public"
  on public.quiz_questions
  for select
  to anon, authenticated
  using (true);

drop policy if exists "quiz_questions_insert_admin_client" on public.quiz_questions;
create policy "quiz_questions_insert_admin_client"
  on public.quiz_questions
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "quiz_questions_update_admin_client" on public.quiz_questions;
create policy "quiz_questions_update_admin_client"
  on public.quiz_questions
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "quiz_questions_delete_admin_client" on public.quiz_questions;
create policy "quiz_questions_delete_admin_client"
  on public.quiz_questions
  for delete
  to anon, authenticated
  using (true);

drop policy if exists "quiz_options_read_public" on public.quiz_options;
create policy "quiz_options_read_public"
  on public.quiz_options
  for select
  to anon, authenticated
  using (true);

drop policy if exists "quiz_options_insert_admin_client" on public.quiz_options;
create policy "quiz_options_insert_admin_client"
  on public.quiz_options
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "quiz_options_update_admin_client" on public.quiz_options;
create policy "quiz_options_update_admin_client"
  on public.quiz_options
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "quiz_options_delete_admin_client" on public.quiz_options;
create policy "quiz_options_delete_admin_client"
  on public.quiz_options
  for delete
  to anon, authenticated
  using (true);

drop policy if exists "quiz_assets_read_public" on public.quiz_assets;
create policy "quiz_assets_read_public"
  on public.quiz_assets
  for select
  to anon, authenticated
  using (true);

drop policy if exists "quiz_assets_insert_admin_client" on public.quiz_assets;
create policy "quiz_assets_insert_admin_client"
  on public.quiz_assets
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "quiz_assets_update_admin_client" on public.quiz_assets;
create policy "quiz_assets_update_admin_client"
  on public.quiz_assets
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "quiz_assets_delete_admin_client" on public.quiz_assets;
create policy "quiz_assets_delete_admin_client"
  on public.quiz_assets
  for delete
  to anon, authenticated
  using (true);

-- Client-side progress/result access (no Supabase Auth yet)
drop policy if exists "user_progress_select_client" on public.user_progress;
create policy "user_progress_select_client"
  on public.user_progress
  for select
  to anon, authenticated
  using (true);

drop policy if exists "user_progress_insert_client" on public.user_progress;
create policy "user_progress_insert_client"
  on public.user_progress
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "user_progress_update_client" on public.user_progress;
create policy "user_progress_update_client"
  on public.user_progress
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "user_progress_delete_client" on public.user_progress;
create policy "user_progress_delete_client"
  on public.user_progress
  for delete
  to anon, authenticated
  using (true);

drop policy if exists "quiz_results_select_client" on public.quiz_results;
create policy "quiz_results_select_client"
  on public.quiz_results
  for select
  to anon, authenticated
  using (true);

drop policy if exists "quiz_results_insert_client" on public.quiz_results;
create policy "quiz_results_insert_client"
  on public.quiz_results
  for insert
  to anon, authenticated
  with check (true);
