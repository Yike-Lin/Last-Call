insert into public.recipe_assets (
  recipe_id,
  asset_type,
  storage_path,
  alt_text,
  width,
  height,
  is_primary,
  sort_order
)
select
  r.id,
  'thumbnail',
  v.storage_path,
  v.alt_text,
  v.width,
  v.height,
  true,
  0
from (
  values
    ('french-75', 'french-75/card.png', '法国 75 鸡尾酒，香槟笛形杯盛装，金色气泡酒液与柠檬装饰。', 1168, 912),
    ('boulevardier', 'boulevardier/card.png', '林荫大道鸡尾酒，冰镇鸡尾酒杯盛装，琥珀红色酒液与橙皮装饰。', 1168, 912)
) as v(recipe_slug, storage_path, alt_text, width, height)
join public.recipes r on r.slug = v.recipe_slug
on conflict (storage_path) do update
set
  recipe_id = excluded.recipe_id,
  alt_text = excluded.alt_text,
  width = excluded.width,
  height = excluded.height,
  is_primary = excluded.is_primary,
  sort_order = excluded.sort_order,
  updated_at = now();
