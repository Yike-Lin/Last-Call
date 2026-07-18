insert into public.glassware (slug, name_en, name_zh, capacity_ml)
values
  ('old-fashioned', 'Old Fashioned Glass', '古典杯', 300),
  ('coupe', 'Coupe Glass', '碟形香槟杯', 180),
  ('highball', 'Highball Glass', '海波杯', 350)
on conflict (slug) do update
set
  name_en = excluded.name_en,
  name_zh = excluded.name_zh,
  capacity_ml = excluded.capacity_ml;

insert into public.ingredients (
  slug,
  name_en,
  name_zh,
  aliases,
  category,
  is_alcoholic,
  default_abv,
  color_hex,
  flavor_tags
)
values
  ('gin', 'Gin', '金酒', '{"杜松子酒"}', 'base-spirit', true, 40.00, '#f2f4f8', '{"juniper","dry"}'),
  ('campari', 'Campari', '金巴利', '{"Italian red bitter liqueur"}', 'amaro', true, 24.00, '#c83d2f', '{"bitter","orange"}'),
  ('sweet-vermouth', 'Sweet Vermouth', '甜味美思', '{"Rosso Vermouth"}', 'fortified-wine', true, 16.00, '#8a4037', '{"herbal","sweet"}'),
  ('tequila-blanco', 'Tequila Blanco', '白龙舌兰', '{"Silver Tequila"}', 'base-spirit', true, 40.00, '#f0f4f8', '{"pepper","citrus"}'),
  ('triple-sec', 'Triple Sec', '橙味利口酒', '{"Orange Liqueur"}', 'liqueur', true, 30.00, '#f2c66d', '{"orange","sweet"}'),
  ('lime-juice', 'Fresh Lime Juice', '新鲜青柠汁', '{"Lime Juice"}', 'citrus', false, null, '#d2f19a', '{"citrus","acid"}'),
  ('white-rum', 'White Rum', '白朗姆', '{"Light Rum"}', 'base-spirit', true, 40.00, '#f5f7fa', '{"light","sugarcane"}'),
  ('simple-syrup', 'Simple Syrup', '糖浆', '{"Sugar Syrup"}', 'sweetener', false, null, '#efe6c8', '{"sweet"}'),
  ('mint', 'Mint', '薄荷', '{"Fresh Mint"}', 'herb', false, null, '#65a56b', '{"mint","fresh"}'),
  ('soda-water', 'Soda Water', '苏打水', '{"Club Soda"}', 'mixer', false, null, '#dbe8ff', '{"sparkling"}'),
  ('bourbon', 'Bourbon', '波本威士忌', '{"Bourbon Whiskey"}', 'base-spirit', true, 45.00, '#b96f36', '{"vanilla","oak"}'),
  ('angostura-bitters', 'Angostura Bitters', '安哥斯图拉苦精', '{"Aromatic Bitters"}', 'bitters', true, 44.70, '#7e3a27', '{"spice","bitter"}')
on conflict (slug) do update
set
  name_en = excluded.name_en,
  name_zh = excluded.name_zh,
  aliases = excluded.aliases,
  category = excluded.category,
  is_alcoholic = excluded.is_alcoholic,
  default_abv = excluded.default_abv,
  color_hex = excluded.color_hex,
  flavor_tags = excluded.flavor_tags;

insert into public.recipes (
  slug,
  name_en,
  name_zh,
  aliases,
  description_en,
  description_zh,
  iba_category,
  primary_spirit_id,
  difficulty,
  glassware_id,
  garnish_text,
  ice_style,
  primary_method,
  prep_time_seconds,
  servings,
  balance_sweet,
  balance_sour,
  balance_bitter,
  balance_spirit,
  estimated_abv,
  status,
  published_at
)
values
  (
    'negroni',
    'Negroni',
    '内格罗尼',
    '{}',
    'An equal-parts classic built around gin, red bitter liqueur, and sweet vermouth.',
    '三种酒等量组合。苦味先到，甜味与草本香气随后展开。',
    'the_unforgettables',
    (select id from public.ingredients where slug = 'gin'),
    1,
    (select id from public.glassware where slug = 'old-fashioned'),
    'Orange half slice',
    'Large ice cube',
    'stir',
    180,
    1,
    2,
    0,
    4,
    4,
    25.00,
    'published',
    now()
  ),
  (
    'margarita',
    'Margarita',
    '玛格丽特',
    '{}',
    'Tequila, orange liqueur, and fresh lime form a bright, tightly balanced sour.',
    '龙舌兰、橙味利口酒与青柠构成明亮而紧致的酸味结构。',
    'contemporary_classics',
    (select id from public.ingredients where slug = 'tequila-blanco'),
    1,
    (select id from public.glassware where slug = 'coupe'),
    'Optional half salt rim',
    'Serve up',
    'shake',
    240,
    1,
    2,
    4,
    0,
    3,
    21.00,
    'published',
    now()
  ),
  (
    'mojito',
    'Mojito',
    '莫吉托',
    '{}',
    'A mint-led long drink with fresh lime, gentle sweetness, and a sparkling finish.',
    '薄荷提香，青柠带来酸度，苏打让整杯酒以清爽气泡收尾。',
    'contemporary_classics',
    (select id from public.ingredients where slug = 'white-rum'),
    2,
    (select id from public.glassware where slug = 'highball'),
    'Mint sprig',
    'Crushed ice',
    'build',
    300,
    1,
    3,
    3,
    0,
    2,
    11.00,
    'published',
    now()
  ),
  (
    'old-fashioned',
    'Old Fashioned',
    '古典',
    '{}',
    'Whiskey shaped with sugar, aromatic bitters, and controlled dilution.',
    '用少量糖与苦精收紧威士忌的轮廓，适合慢慢啜饮。',
    'the_unforgettables',
    (select id from public.ingredients where slug = 'bourbon'),
    1,
    (select id from public.glassware where slug = 'old-fashioned'),
    'Orange zest',
    'Large ice cube',
    'stir',
    180,
    1,
    2,
    0,
    1,
    5,
    29.00,
    'published',
    now()
  )
on conflict (slug) do update
set
  name_en = excluded.name_en,
  name_zh = excluded.name_zh,
  aliases = excluded.aliases,
  description_en = excluded.description_en,
  description_zh = excluded.description_zh,
  iba_category = excluded.iba_category,
  primary_spirit_id = excluded.primary_spirit_id,
  difficulty = excluded.difficulty,
  glassware_id = excluded.glassware_id,
  garnish_text = excluded.garnish_text,
  ice_style = excluded.ice_style,
  primary_method = excluded.primary_method,
  prep_time_seconds = excluded.prep_time_seconds,
  servings = excluded.servings,
  balance_sweet = excluded.balance_sweet,
  balance_sour = excluded.balance_sour,
  balance_bitter = excluded.balance_bitter,
  balance_spirit = excluded.balance_spirit,
  estimated_abv = excluded.estimated_abv,
  status = excluded.status,
  published_at = excluded.published_at;

with ingredient_rows (
  recipe_slug,
  ingredient_slug,
  role,
  amount_value,
  unit_code,
  display_amount,
  normalized_ml,
  preparation_note,
  sort_order,
  is_optional
) as (
  values
    ('negroni', 'gin', 'base', 30.0, 'ml', '30 ml', 30.0, null, 1, false),
    ('negroni', 'campari', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 2, false),
    ('negroni', 'sweet-vermouth', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 3, false),
    ('margarita', 'tequila-blanco', 'base', 50.0, 'ml', '50 ml', 50.0, null, 1, false),
    ('margarita', 'triple-sec', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 2, false),
    ('margarita', 'lime-juice', 'modifier', 20.0, 'ml', '20 ml', 20.0, 'Freshly squeezed', 3, false),
    ('mojito', 'white-rum', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('mojito', 'lime-juice', 'modifier', 20.0, 'ml', '20 ml', 20.0, 'Freshly squeezed', 2, false),
    ('mojito', 'simple-syrup', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 3, false),
    ('mojito', 'mint', 'modifier', 8.0, 'piece', '8 片叶', null, 'Gently pressed', 4, false),
    ('mojito', 'soda-water', 'mixer', null, 'top_up', '加满', null, null, 5, false),
    ('old-fashioned', 'bourbon', 'base', 60.0, 'ml', '60 ml', 60.0, null, 1, false),
    ('old-fashioned', 'simple-syrup', 'modifier', 7.5, 'ml', '7.5 ml', 7.5, null, 2, false),
    ('old-fashioned', 'angostura-bitters', 'modifier', 2.0, 'dash', '2 dash', null, null, 3, false)
)
insert into public.recipe_ingredients (
  recipe_id,
  ingredient_id,
  role,
  amount_value,
  unit_code,
  display_amount,
  normalized_ml,
  preparation_note,
  sort_order,
  is_optional
)
select
  r.id,
  i.id,
  v.role,
  v.amount_value,
  v.unit_code,
  v.display_amount,
  v.normalized_ml,
  v.preparation_note,
  v.sort_order,
  v.is_optional
from ingredient_rows v
join public.recipes r on r.slug = v.recipe_slug
join public.ingredients i on i.slug = v.ingredient_slug
where not exists (
  select 1
  from public.recipe_ingredients existing
  where existing.recipe_id = r.id
    and existing.sort_order = v.sort_order
);

with step_rows (
  recipe_slug,
  step_number,
  action_type,
  instruction_en,
  instruction_zh
) as (
  values
    ('negroni', 1, 'build', 'Pour all ingredients into a chilled old fashioned glass filled with ice.', '把全部原料倒入装有冰块的冰镇古典杯。'),
    ('negroni', 2, 'stir', 'Stir gently until chilled and lightly diluted.', '轻柔搅拌，直到酒液冰冷并完成适度稀释。'),
    ('negroni', 3, 'garnish', 'Finish with half an orange slice.', '用半片橙子完成装饰。'),
    ('margarita', 1, 'prepare', 'Chill the coupe and prepare an optional half salt rim.', '冰镇杯具，并按需要制作半圈盐边。'),
    ('margarita', 2, 'shake', 'Shake all liquid ingredients hard with ice.', '将全部液体原料与冰块充分摇和。'),
    ('margarita', 3, 'strain', 'Fine strain into the chilled coupe.', '细滤到冰镇后的碟形香槟杯中。'),
    ('mojito', 1, 'muddle', 'Gently press mint with lime juice and syrup.', '将薄荷与青柠汁、糖浆轻压出香气。'),
    ('mojito', 2, 'build', 'Add rum and fill the glass with crushed ice.', '加入朗姆酒，并用碎冰填满杯子。'),
    ('mojito', 3, 'top', 'Top with soda water and lift gently to combine.', '补满苏打水，再轻轻提拉混合。'),
    ('mojito', 4, 'garnish', 'Finish with a fresh mint sprig.', '用一束新鲜薄荷完成装饰。'),
    ('old-fashioned', 1, 'stir', 'Stir whiskey, syrup, and bitters with ice until chilled.', '将威士忌、糖浆和苦精与冰块搅拌至冰冷。'),
    ('old-fashioned', 2, 'strain', 'Strain over a fresh large ice cube.', '滤入装有新鲜大冰块的古典杯。'),
    ('old-fashioned', 3, 'garnish', 'Express orange zest over the drink and garnish.', '挤压橙皮释放香气后完成装饰。')
)
insert into public.recipe_steps (
  recipe_id,
  step_number,
  action_type,
  instruction_en,
  instruction_zh
)
select r.id, v.step_number, v.action_type, v.instruction_en, v.instruction_zh
from step_rows v
join public.recipes r on r.slug = v.recipe_slug
on conflict (recipe_id, step_number) do update
set
  action_type = excluded.action_type,
  instruction_en = excluded.instruction_en,
  instruction_zh = excluded.instruction_zh;

insert into public.tags (slug, label_en, label_zh, type)
values
  ('bitter', 'Bittersweet', '苦甜', 'flavor'),
  ('herbal', 'Herbal', '草本', 'flavor'),
  ('citrus', 'Citrus', '柑橘', 'flavor'),
  ('sour', 'Sour', '酸爽', 'flavor'),
  ('refreshing', 'Refreshing', '清爽', 'flavor'),
  ('mint', 'Mint', '薄荷', 'flavor'),
  ('sparkling', 'Sparkling', '气泡', 'flavor'),
  ('orange', 'Orange aroma', '橙香', 'flavor'),
  ('spirit-forward', 'Spirit-forward', '酒感', 'style'),
  ('short-drink', 'Short drink', '短饮', 'style'),
  ('long-drink', 'Long drink', '长饮', 'style'),
  ('slow-sipping', 'Slow sipping', '慢饮', 'occasion')
on conflict (slug) do update
set
  label_en = excluded.label_en,
  label_zh = excluded.label_zh,
  type = excluded.type;

with tag_rows (recipe_slug, tag_slug) as (
  values
    ('negroni', 'bitter'),
    ('negroni', 'herbal'),
    ('negroni', 'spirit-forward'),
    ('negroni', 'short-drink'),
    ('margarita', 'sour'),
    ('margarita', 'citrus'),
    ('margarita', 'refreshing'),
    ('margarita', 'short-drink'),
    ('mojito', 'mint'),
    ('mojito', 'refreshing'),
    ('mojito', 'sparkling'),
    ('mojito', 'long-drink'),
    ('old-fashioned', 'spirit-forward'),
    ('old-fashioned', 'orange'),
    ('old-fashioned', 'slow-sipping'),
    ('old-fashioned', 'short-drink')
)
insert into public.recipe_tags (recipe_id, tag_id)
select r.id, t.id
from tag_rows v
join public.recipes r on r.slug = v.recipe_slug
join public.tags t on t.slug = v.tag_slug
on conflict (recipe_id, tag_id) do nothing;

with source_rows (
  recipe_slug,
  external_id,
  source_category,
  source_url
) as (
  values
    ('negroni', 'negroni', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/negroni/'),
    ('margarita', 'margarita', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/margarita/'),
    ('mojito', 'mojito', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/mojito/'),
    ('old-fashioned', 'old-fashioned', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/old-fashioned/')
)
insert into public.recipe_sources (
  recipe_id,
  source_type,
  source_name,
  source_url,
  external_id,
  source_category,
  is_primary,
  rights_note
)
select
  r.id,
  'iba',
  'International Bartenders Association',
  v.source_url,
  v.external_id,
  v.source_category,
  true,
  'Recipe facts referenced only. Source copy and images are not imported.'
from source_rows v
join public.recipes r on r.slug = v.recipe_slug
on conflict (recipe_id, source_url) do update
set
  external_id = excluded.external_id,
  source_category = excluded.source_category,
  retrieved_at = now(),
  rights_note = excluded.rights_note;

with asset_rows (
  recipe_slug,
  storage_path,
  alt_text,
  width,
  height
) as (
  values
    ('negroni', 'negroni/card.png', '内格罗尼鸡尾酒，短杯盛装，红色酒液与橙皮装饰。', 1168, 912),
    ('margarita', 'margarita/card.png', '玛格丽特鸡尾酒，碟形香槟杯盛装，浅青柠黄色酒液、半圈盐边与青柠装饰。', 1168, 912),
    ('mojito', 'mojito/card.png', '莫吉托鸡尾酒，海波杯盛装，碎冰、薄荷、青柠与清透气泡。', 1168, 912),
    ('old-fashioned', 'old-fashioned/card.png', '古典鸡尾酒，厚底古典杯盛装，琥珀色酒液、大冰块与橙皮装饰。', 1168, 912)
)
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
from asset_rows v
join public.recipes r on r.slug = v.recipe_slug
on conflict (storage_path) do update
set
  alt_text = excluded.alt_text,
  width = excluded.width,
  height = excluded.height,
  is_primary = excluded.is_primary,
  sort_order = excluded.sort_order,
  updated_at = now();
