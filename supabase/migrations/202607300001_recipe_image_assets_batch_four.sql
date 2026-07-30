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
    ('bloody-mary', 'bloody-mary/card.png', '血腥玛丽鸡尾酒，红色番茄酒液以高杯盛装，饰以芹菜、柠檬角和番茄。', 1168, 912),
    ('bramble', 'bramble/card.png', '荆棘鸡尾酒，莓红色酒液与碎冰以高脚杯盛装，饰以黑莓和柠檬片。', 1168, 912),
    ('brandy-crusta', 'brandy-crusta/card.png', '白兰地克鲁斯塔鸡尾酒，琥珀色酒液以细长高脚杯盛装，杯口裹糖并饰以柠檬皮。', 1168, 912),
    ('caipirinha', 'caipirinha/card.png', '凯匹林纳鸡尾酒，透明酒液与青柠块、碎冰以古典杯盛装，饰以青柠片。', 1168, 912),
    ('canchanchara', 'canchanchara/card.png', '坎昌查拉鸡尾酒，棕金色酒液与碎冰以陶杯盛装，饰以青柠片并配搅拌棒。', 1168, 912),
    ('cardinale', 'cardinale/card.png', '卡迪纳莱鸡尾酒，深红色酒液以高脚鸡尾酒杯盛装，饰以橙皮。', 1168, 912),
    ('casino', 'casino/card.png', '卡西诺鸡尾酒，浅色酒液与冰块以古典杯盛装，饰以柠檬皮和红樱桃。', 1168, 912),
    ('champagne-cocktail', 'champagne-cocktail/card.png', '香槟鸡尾酒，金色气泡酒液以香槟笛形杯盛装，饰以橙皮和红樱桃。', 1168, 912),
    ('chartreuse-swizzle', 'chartreuse-swizzle/card.png', '夏特勒斯斯威泽鸡尾酒，亮绿色酒液与碎冰以高脚杯盛装，饰以薄荷和柠檬片。', 1168, 912),
    ('corpse-reviver-2', 'corpse-reviver-2/card.png', '死而复生二号鸡尾酒，浅黄色酒液以碟形鸡尾酒杯盛装，饰以柠檬皮。', 1168, 912)
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
