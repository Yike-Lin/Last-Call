create extension if not exists pg_trgm;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.ingredients
  rename column name to name_en;

alter table public.ingredients
  rename column abv to default_abv;

alter table public.ingredients
  add column name_zh text,
  add column aliases text[] not null default '{}',
  add column parent_id uuid references public.ingredients (id) on delete set null,
  add column updated_at timestamptz not null default now();

alter table public.ingredients
  add constraint ingredients_default_abv_range
    check (default_abv is null or default_abv between 0 and 100),
  add constraint ingredients_parent_not_self
    check (parent_id is null or parent_id <> id);

create table public.glassware (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null unique,
  name_zh text,
  capacity_ml numeric(7,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint glassware_capacity_positive
    check (capacity_ml is null or capacity_ml > 0)
);

insert into public.glassware (slug, name_en)
select distinct
  coalesce(
    nullif(trim(both '-' from regexp_replace(lower(glassware), '[^a-z0-9]+', '-', 'g')), ''),
    'glass-' || substr(md5(glassware), 1, 12)
  ),
  glassware
from public.recipes
where nullif(trim(glassware), '') is not null
on conflict (name_en) do nothing;

alter table public.recipes
  rename column name to name_en;

alter table public.recipes
  rename column description to description_en;

alter table public.recipes
  rename column garnish to garnish_text;

alter table public.recipes
  rename column method to primary_method;

alter table public.recipes
  add column name_zh text,
  add column aliases text[] not null default '{}',
  add column description_zh text,
  add column iba_category text,
  add column origin_country_code text,
  add column primary_spirit_id uuid references public.ingredients (id) on delete set null,
  add column glassware_id uuid references public.glassware (id) on delete restrict,
  add column ice_style text,
  add column prep_time_seconds integer,
  add column servings numeric(5,2) not null default 1,
  add column pure_alcohol_g numeric(7,2),
  add column calories_kcal numeric(7,2),
  add column status text not null default 'draft',
  add column reviewed_by uuid references auth.users (id) on delete set null,
  add column reviewed_at timestamptz,
  add column published_at timestamptz,
  add column updated_at timestamptz not null default now();

update public.recipes r
set glassware_id = g.id
from public.glassware g
where lower(g.name_en) = lower(r.glassware);

update public.recipes r
set primary_spirit_id = (
  select i.id
  from public.ingredients i
  where i.category = 'base-spirit'
    and (
      lower(i.name_en) = lower(r.base_spirit)
      or lower(i.name_en) like '%' || lower(r.base_spirit) || '%'
      or i.slug = trim(both '-' from regexp_replace(lower(r.base_spirit), '[^a-z0-9]+', '-', 'g'))
    )
  order by (lower(i.name_en) = lower(r.base_spirit)) desc, i.name_en
  limit 1
)
where r.primary_spirit_id is null;

update public.recipes
set
  status = case when is_published then 'published' else 'draft' end,
  published_at = case when is_published then created_at else null end;

alter table public.recipes
  add constraint recipes_difficulty_range
    check (difficulty between 1 and 3),
  add constraint recipes_iba_category_valid
    check (
      iba_category is null
      or iba_category in ('the_unforgettables', 'contemporary_classics', 'new_era')
    ),
  add constraint recipes_origin_country_code_valid
    check (origin_country_code is null or origin_country_code ~ '^[A-Z]{2}$'),
  add constraint recipes_prep_time_nonnegative
    check (prep_time_seconds is null or prep_time_seconds >= 0),
  add constraint recipes_servings_positive
    check (servings > 0),
  add constraint recipes_estimated_abv_range
    check (estimated_abv is null or estimated_abv between 0 and 100),
  add constraint recipes_pure_alcohol_nonnegative
    check (pure_alcohol_g is null or pure_alcohol_g >= 0),
  add constraint recipes_calories_nonnegative
    check (calories_kcal is null or calories_kcal >= 0),
  add constraint recipes_balance_sweet_range check (balance_sweet between 0 and 5),
  add constraint recipes_balance_sour_range check (balance_sour between 0 and 5),
  add constraint recipes_balance_bitter_range check (balance_bitter between 0 and 5),
  add constraint recipes_balance_spirit_range check (balance_spirit between 0 and 5),
  add constraint recipes_status_valid
    check (status in ('draft', 'review', 'published', 'archived'));

create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  step_number smallint not null,
  action_type text,
  instruction_en text,
  instruction_zh text,
  duration_seconds integer,
  created_at timestamptz not null default now(),
  unique (recipe_id, step_number),
  constraint recipe_steps_number_positive check (step_number > 0),
  constraint recipe_steps_duration_nonnegative
    check (duration_seconds is null or duration_seconds >= 0),
  constraint recipe_steps_instruction_present
    check (
      nullif(trim(instruction_en), '') is not null
      or nullif(trim(instruction_zh), '') is not null
    )
);

insert into public.recipe_steps (recipe_id, step_number, instruction_en)
select r.id, s.ordinality::smallint, s.instruction
from public.recipes r
cross join lateral unnest(r.instructions) with ordinality as s(instruction, ordinality)
where nullif(trim(s.instruction), '') is not null
on conflict (recipe_id, step_number) do nothing;

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label_en text not null,
  label_zh text,
  type text not null default 'flavor',
  created_at timestamptz not null default now(),
  constraint tags_type_valid
    check (type in ('flavor', 'style', 'occasion', 'temperature', 'other'))
);

insert into public.tags (slug, label_en, type)
select distinct
  coalesce(
    nullif(trim(both '-' from regexp_replace(lower(tag), '[^a-z0-9]+', '-', 'g')), ''),
    'tag-' || substr(md5(tag), 1, 12)
  ),
  tag,
  'flavor'
from public.recipes r
cross join lateral unnest(r.flavor_tags) as tag
where nullif(trim(tag), '') is not null
on conflict (slug) do nothing;

create table public.recipe_tags (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (recipe_id, tag_id)
);

insert into public.recipe_tags (recipe_id, tag_id)
select r.id, t.id
from public.recipes r
cross join lateral unnest(r.flavor_tags) as source_tag
join public.tags t
  on t.slug = coalesce(
    nullif(trim(both '-' from regexp_replace(lower(source_tag), '[^a-z0-9]+', '-', 'g')), ''),
    'tag-' || substr(md5(source_tag), 1, 12)
  )
on conflict (recipe_id, tag_id) do nothing;

alter table public.recipe_ingredients
  rename column amount to amount_value;

alter table public.recipe_ingredients
  rename column unit to unit_code;

alter table public.recipe_ingredients
  alter column amount_value drop not null,
  add column role text not null default 'modifier',
  add column display_amount text,
  add column normalized_ml numeric(9,3),
  add column preparation_note text;

update public.recipe_ingredients
set display_amount = trim(concat(amount_value::text, ' ', unit_code))
where display_amount is null;

alter table public.recipe_ingredients
  add constraint recipe_ingredients_amount_nonnegative
    check (amount_value is null or amount_value >= 0),
  add constraint recipe_ingredients_normalized_ml_nonnegative
    check (normalized_ml is null or normalized_ml >= 0),
  add constraint recipe_ingredients_role_valid
    check (role in ('base', 'modifier', 'mixer', 'garnish'));

create table public.recipe_sources (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  source_type text not null,
  source_name text not null,
  source_url text not null,
  external_id text,
  source_category text,
  retrieved_at timestamptz not null default now(),
  is_primary boolean not null default false,
  rights_note text,
  editor_notes text,
  created_at timestamptz not null default now(),
  unique (recipe_id, source_url),
  constraint recipe_sources_type_valid
    check (source_type in ('iba', 'professional_guide', 'book', 'brand', 'other'))
);

create table public.asset_licenses (
  id uuid primary key default gen_random_uuid(),
  rights_holder text not null,
  license_type text not null,
  source_url text,
  credit_text text,
  proof_storage_path text,
  commercial_use_allowed boolean not null default false,
  modification_allowed boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_assets (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  license_id uuid references public.asset_licenses (id) on delete restrict,
  asset_type text not null,
  storage_path text not null unique,
  alt_text text not null,
  width integer,
  height integer,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recipe_assets_type_valid
    check (asset_type in ('hero', 'thumbnail', 'gallery', 'video')),
  constraint recipe_assets_width_positive check (width is null or width > 0),
  constraint recipe_assets_height_positive check (height is null or height > 0)
);

drop policy if exists "public read recipes" on public.recipes;
drop policy if exists "public read recipe ingredients" on public.recipe_ingredients;

alter table public.recipes
  drop column base_spirit,
  drop column glassware,
  drop column instructions,
  drop column flavor_tags,
  drop column is_published;

create index idx_recipes_status on public.recipes (status);
create index idx_recipes_iba_category on public.recipes (iba_category);
create index idx_recipes_primary_spirit_id on public.recipes (primary_spirit_id);
create index idx_recipes_glassware_id on public.recipes (glassware_id);
create index idx_recipes_name_en_trgm on public.recipes using gin (name_en gin_trgm_ops);
create index idx_recipes_name_zh_trgm on public.recipes using gin (name_zh gin_trgm_ops);
create index idx_ingredients_name_en_trgm on public.ingredients using gin (name_en gin_trgm_ops);
create index idx_ingredients_name_zh_trgm on public.ingredients using gin (name_zh gin_trgm_ops);
create index idx_recipe_ingredients_role on public.recipe_ingredients (recipe_id, role);
create index idx_recipe_steps_recipe_id on public.recipe_steps (recipe_id, step_number);
create index idx_tags_type on public.tags (type);
create index idx_recipe_tags_tag_id on public.recipe_tags (tag_id, recipe_id);
create index idx_recipe_sources_recipe_id on public.recipe_sources (recipe_id);
create index idx_recipe_assets_recipe_id on public.recipe_assets (recipe_id, sort_order);
create unique index idx_recipe_assets_one_primary_per_type
  on public.recipe_assets (recipe_id, asset_type)
  where is_primary;

create trigger set_ingredients_updated_at
before update on public.ingredients
for each row execute function public.set_updated_at();

create trigger set_recipes_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

create trigger set_glassware_updated_at
before update on public.glassware
for each row execute function public.set_updated_at();

create trigger set_asset_licenses_updated_at
before update on public.asset_licenses
for each row execute function public.set_updated_at();

create trigger set_recipe_assets_updated_at
before update on public.recipe_assets
for each row execute function public.set_updated_at();

alter table public.glassware enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.tags enable row level security;
alter table public.recipe_tags enable row level security;
alter table public.recipe_sources enable row level security;
alter table public.asset_licenses enable row level security;
alter table public.recipe_assets enable row level security;

create policy "public read published recipes"
on public.recipes
for select
using (status = 'published');

create policy "public read published recipe ingredients"
on public.recipe_ingredients
for select
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_ingredients.recipe_id
      and r.status = 'published'
  )
);

create policy "public read glassware"
on public.glassware
for select
using (true);

create policy "public read published recipe steps"
on public.recipe_steps
for select
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_steps.recipe_id
      and r.status = 'published'
  )
);

create policy "public read tags"
on public.tags
for select
using (true);

create policy "public read published recipe tags"
on public.recipe_tags
for select
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_tags.recipe_id
      and r.status = 'published'
  )
);

create policy "public read published recipe assets"
on public.recipe_assets
for select
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_assets.recipe_id
      and r.status = 'published'
  )
);

grant usage on schema public to anon, authenticated;

grant select on table
  public.recipes,
  public.ingredients,
  public.glassware,
  public.recipe_ingredients,
  public.recipe_steps,
  public.tags,
  public.recipe_tags,
  public.recipe_assets
to anon, authenticated;
