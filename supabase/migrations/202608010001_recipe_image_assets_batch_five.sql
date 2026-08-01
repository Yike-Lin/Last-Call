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
    ('cosmopolitan', 'cosmopolitan/card.png', '大都会鸡尾酒，粉红色酒液以鸡尾酒杯盛装，饰以橙皮。', 1168, 912),
    ('cuba-libre', 'cuba-libre/card.png', '自由古巴鸡尾酒，深色可乐酒液与冰块以海波杯盛装，饰以青柠片。', 1168, 912),
    ('dark-n-stormy', 'dark-n-stormy/card.png', '黑暗风暴鸡尾酒，姜汁啤酒与黑朗姆分层，以海波杯盛装并饰以青柠和薄荷。', 1168, 912),
    ('dons-special-daiquiri', 'dons-special-daiquiri/card.png', '唐恩特调得其利鸡尾酒，浅金色冰沙酒液以高脚杯盛装，饰以青柠片和百香果。', 1168, 912),
    ('espresso-martini', 'espresso-martini/card.png', '浓缩咖啡马天尼鸡尾酒，深棕色咖啡泡沫酒液以鸡尾酒杯盛装，饰以咖啡豆。', 1168, 912),
    ('fernandito', 'fernandito/card.png', '费尔南迪托鸡尾酒，深色可乐酒液与冰块以古典杯盛装，饰以橙片。', 1168, 912),
    ('french-connection', 'french-connection/card.png', '法国贩毒网鸡尾酒，琥珀色酒液与冰块以小高脚杯盛装。', 1168, 912),
    ('french-martini', 'french-martini/card.png', '法国马天尼鸡尾酒，粉色泡沫酒液以鸡尾酒杯盛装，饰以柠檬皮和青柠片。', 1168, 912),
    ('garibaldi', 'garibaldi/card.png', '加里波第鸡尾酒，橙红色酒液与冰块以高杯盛装，饰以橙片和薄荷。', 1168, 912),
    ('gin-basil-smash', 'gin-basil-smash/card.png', '金酒罗勒碎鸡尾酒，浅绿色酒液以鸡尾酒杯盛装，饰以罗勒叶。', 1168, 912)
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
