create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  preferred_unit text not null default 'metric',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  is_alcoholic boolean not null default false,
  abv numeric(5,2),
  color_hex text,
  flavor_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  base_spirit text not null,
  difficulty smallint not null default 1,
  glassware text not null,
  garnish text,
  method text not null,
  instructions text[] not null default '{}',
  flavor_tags text[] not null default '{}',
  balance_sweet smallint not null default 0,
  balance_sour smallint not null default 0,
  balance_bitter smallint not null default 0,
  balance_spirit smallint not null default 0,
  estimated_abv numeric(5,2),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id) on delete restrict,
  amount numeric(8,2) not null,
  unit text not null,
  sort_order integer not null default 0,
  is_optional boolean not null default false
);

create table if not exists public.user_cabinet_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id) on delete cascade,
  status text not null default 'owned',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ingredient_id)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

create table if not exists public.mix_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_id uuid references public.recipes (id) on delete set null,
  status text not null default 'draft',
  selected_glassware text,
  selected_method text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.mix_session_steps (
  id uuid primary key default gen_random_uuid(),
  mix_session_id uuid not null references public.mix_sessions (id) on delete cascade,
  step_index integer not null,
  action_type text not null,
  ingredient_id uuid references public.ingredients (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tasting_results (
  id uuid primary key default gen_random_uuid(),
  mix_session_id uuid not null unique references public.mix_sessions (id) on delete cascade,
  appearance text,
  body text,
  flavor_tags text[] not null default '{}',
  balance_sweet smallint not null default 0,
  balance_sour smallint not null default 0,
  balance_bitter smallint not null default 0,
  balance_spirit smallint not null default 0,
  suggested_occasions text[] not null default '{}',
  summary text,
  user_notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_recipes_slug on public.recipes (slug);
create index if not exists idx_recipes_base_spirit on public.recipes (base_spirit);
create index if not exists idx_ingredients_slug on public.ingredients (slug);
create index if not exists idx_recipe_ingredients_recipe_id on public.recipe_ingredients (recipe_id);
create index if not exists idx_recipe_ingredients_ingredient_id on public.recipe_ingredients (ingredient_id);
create index if not exists idx_user_cabinet_items_user_id on public.user_cabinet_items (user_id);
create index if not exists idx_favorites_user_id on public.favorites (user_id);
create index if not exists idx_mix_sessions_user_id on public.mix_sessions (user_id);
create index if not exists idx_mix_session_steps_mix_session_id on public.mix_session_steps (mix_session_id);

alter table public.profiles enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.user_cabinet_items enable row level security;
alter table public.favorites enable row level security;
alter table public.mix_sessions enable row level security;
alter table public.mix_session_steps enable row level security;
alter table public.tasting_results enable row level security;

create policy "public read ingredients"
on public.ingredients
for select
using (true);

create policy "public read recipes"
on public.recipes
for select
using (is_published = true);

create policy "public read recipe ingredients"
on public.recipe_ingredients
for select
using (true);

create policy "users read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "users update own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "users insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "users manage own cabinet"
on public.user_cabinet_items
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage own favorites"
on public.favorites
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage own mix sessions"
on public.mix_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage own mix session steps"
on public.mix_session_steps
for all
using (
  exists (
    select 1
    from public.mix_sessions s
    where s.id = mix_session_steps.mix_session_id
      and s.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.mix_sessions s
    where s.id = mix_session_steps.mix_session_id
      and s.user_id = auth.uid()
  )
);

create policy "users manage own tasting results"
on public.tasting_results
for all
using (
  exists (
    select 1
    from public.mix_sessions s
    where s.id = tasting_results.mix_session_id
      and s.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.mix_sessions s
    where s.id = tasting_results.mix_session_id
      and s.user_id = auth.uid()
  )
);
