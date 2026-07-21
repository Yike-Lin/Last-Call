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
    ('daiquiri', 'daiquiri/card.png', '得其利鸡尾酒，冰镇鸡尾酒杯盛装，朗姆酒与青柠组成的明亮酸酒。', 1168, 912),
    ('sidecar', 'sidecar/card.png', '边车鸡尾酒，冰镇鸡尾酒杯盛装，干邑、橙味利口酒与柠檬组成的酸酒。', 1168, 912),
    ('clover-club', 'clover-club/card.png', '三叶草俱乐部鸡尾酒，粉红色酒液与覆盆子装饰。', 1168, 912),
    ('old-fashioned', 'old-fashioned/card.png', '古典鸡尾酒，古典杯盛装，琥珀色酒液与大冰块。', 1168, 912),
    ('whiskey-sour', 'whiskey-sour/card.png', '威士忌酸鸡尾酒，古典杯盛装，威士忌酸酒与橙子装饰。', 1168, 912),
    ('negroni', 'negroni/card.png', '尼格罗尼鸡尾酒，古典杯盛装，红色酒液与橙皮装饰。', 1168, 912),
    ('dry-martini', 'dry-martini/card.png', '干马天尼鸡尾酒，马天尼杯盛装，清澈酒液与柠檬皮装饰。', 1168, 912),
    ('manhattan', 'manhattan/card.png', '曼哈顿鸡尾酒，鸡尾酒杯盛装，深色酒液与樱桃装饰。', 1168, 912),
    ('margarita', 'margarita/card.png', '玛格丽特鸡尾酒，碟形香槟杯盛装，青柠色酒液与盐边。', 1168, 912),
    ('mojito', 'mojito/card.png', '莫吉托鸡尾酒，海波杯盛装，碎冰、薄荷、青柠与气泡。', 1168, 912),
    ('moscow-mule', 'moscow-mule/card.png', '莫斯科骡子鸡尾酒，骡子杯盛装，姜汁啤酒与青柠。', 1168, 912),
    ('aviation', 'aviation/card.png', '飞行鸡尾酒，冰镇鸡尾酒杯盛装，淡紫色酒液与花香。', 1168, 912)
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
