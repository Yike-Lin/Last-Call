grant usage on schema public to service_role;

grant select on table public.recipes to service_role;
grant insert, update, select on table public.recipe_assets to service_role;
