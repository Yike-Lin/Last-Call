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
    ('alexander', 'alexander/card.png', '亚历山大鸡尾酒，浅色奶油质感酒液，以碟形鸡尾酒杯盛装并饰以橙皮。', 1168, 912),
    ('angel-face', 'angel-face/card.png', '天使之颜鸡尾酒，金色酒液，以碟形鸡尾酒杯盛装并饰以橙皮。', 1168, 912),
    ('bellini', 'bellini/card.png', '贝里尼鸡尾酒，桃粉色气泡酒液，以香槟笛形杯盛装并饰以桃片。', 1168, 912),
    ('americano', 'americano/card.png', '阿美利加诺鸡尾酒，红色气泡酒液与冰块，以海波杯盛装并饰以橙片和橙皮。', 1168, 912),
    ('between-the-sheets', 'between-the-sheets/card.png', '床笫之间鸡尾酒，金色酒液，以碟形鸡尾酒杯盛装并饰以橙皮。', 1168, 912),
    ('bees-knees', 'bees-knees/card.png', '蜂之膝鸡尾酒，明黄色酒液与大冰块，以高脚杯盛装并饰以柑橘和绿叶。', 1419, 1108),
    ('black-russian', 'black-russian/card.png', '黑俄罗斯鸡尾酒，深色酒液与冰块，以古典杯盛装并饰以橙皮。', 1168, 912)
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
