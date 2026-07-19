-- Add ten IBA recipe records without importing copyrighted images or page copy.

insert into public.glassware (slug, name_en, name_zh, capacity_ml)
values
  ('martini-glass', 'Martini Cocktail Glass', '马天尼杯', 220),
  ('mule-cup', 'Mule Cup', '骡子杯', 400),
  ('champagne-flute', 'Champagne Flute', '香槟笛形杯', 180)
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
  ('superfine-sugar', 'Superfine Sugar', '超细砂糖', '{Caster Sugar}', 'sweetener', false, null, '#efe6c8', '{sweet}'),
  ('dry-vermouth', 'Dry Vermouth', '干味美思', '{French Vermouth}', 'fortified-wine', true, 16.00, '#e8dfc1', '{dry,herbal}'),
  ('rye-whiskey', 'Rye Whiskey', '黑麦威士忌', '{Rye Whisky}', 'base-spirit', true, 45.00, '#b96f36', '{spice,oak}'),
  ('lemon-juice', 'Fresh Lemon Juice', '新鲜柠檬汁', '{Lemon Juice}', 'citrus', false, null, '#f0e486', '{citrus,acid}'),
  ('egg-white', 'Egg White', '蛋清', '{Fresh Egg White}', 'modifier', false, null, '#f4efe4', '{texture}'),
  ('cognac', 'Cognac', '干邑', '{Cognac Brandy}', 'base-spirit', true, 40.00, '#c48b4b', '{fruit,oak}'),
  ('maraschino', 'Maraschino Luxardo', '马拉斯奇诺利口酒', '{Maraschino Liqueur}', 'liqueur', true, 32.00, '#f1e6c8', '{cherry,almond}'),
  ('creme-de-violette', 'Creme de Violette', '紫罗兰利口酒', '{Violet Liqueur}', 'liqueur', true, 20.00, '#8c6ea8', '{floral}'),
  ('raspberry-syrup', 'Raspberry Syrup', '覆盆子糖浆', '{Raspberry Cordial}', 'sweetener', false, null, '#b84355', '{berry,sweet}'),
  ('vodka', 'Vodka', '伏特加', '{}', 'base-spirit', true, 40.00, '#eef2f4', '{clean,neutral}'),
  ('ginger-beer', 'Ginger Beer', '姜汁啤酒', '{Ginger Ale}', 'mixer', false, null, '#d8bb6b', '{ginger,spicy,sparkling}'),
  ('champagne', 'Champagne', '香槟', '{Sparkling Wine}', 'sparkling-wine', true, 12.00, '#f0dd9d', '{sparkling,fruit}')
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
  ('daiquiri', 'Daiquiri', '代基里', '{}', 'A precise rum sour with fresh lime and superfine sugar.', '朗姆酒、青柠与细砂糖组成的经典酸酒，明亮、直接而利落。', 'the_unforgettables', (select id from public.ingredients where slug = 'white-rum'), 1, (select id from public.glassware where slug = 'coupe'), 'N/A', 'Serve up', 'shake', 240, 1, 3, 4, 0, 3, 20.00, 'published', now()),
  ('dry-martini', 'Dry Martini', '干马天尼', '{}', 'Gin and dry vermouth, stirred cold and served with a clean, aromatic finish.', '金酒与干味美思的冷冽组合，干净、克制，尾韵带着柠檬皮或橄榄的香气。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'martini-glass'), '挤压柠檬皮释放油脂，或按需用青橄榄装饰。', 'Ice cubes, serve up', 'stir', 180, 1, 0, 0, 1, 5, 26.00, 'published', now()),
  ('manhattan', 'Manhattan', '曼哈顿', '{}', 'Rye whiskey, sweet vermouth, and bitters in a deep, spirit-forward classic.', '黑麦威士忌、甜味美思与苦精构成的深色经典，辛香、醇厚而适合慢饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'rye-whiskey'), 2, (select id from public.glassware where slug = 'coupe'), '鸡尾酒樱桃。', 'Ice cubes, serve up', 'stir', 180, 1, 3, 0, 2, 4, 27.00, 'published', now()),
  ('whiskey-sour', 'Whiskey Sour', '威士忌酸', '{}', 'Bourbon, lemon, and sugar sharpened with an optional egg-white texture.', '波本威士忌、柠檬与糖浆组成的酸酒，可用蛋清增加柔滑泡沫。', 'the_unforgettables', (select id from public.ingredients where slug = 'bourbon'), 2, (select id from public.glassware where slug = 'old-fashioned'), '半片橙子与马拉斯奇诺樱桃，可选橙皮。', 'Serve up or over a large ice cube', 'shake', 300, 1, 3, 4, 1, 3, 20.00, 'published', now()),
  ('sidecar', 'Sidecar', '侧车', '{}', 'Cognac, orange liqueur, and lemon in a bright, dry-leaning sour.', '干邑、橙味利口酒与柠檬汁组成的明亮酸酒，酸度清晰，酒体紧致。', 'the_unforgettables', (select id from public.ingredients where slug = 'cognac'), 2, (select id from public.glassware where slug = 'coupe'), 'N/A', 'Serve up', 'shake', 240, 1, 3, 4, 0, 3, 24.00, 'published', now()),
  ('aviation', 'Aviation', '飞行', '{}', 'Gin, maraschino, lemon, and violet create a floral, pale cocktail.', '金酒、马拉斯奇诺、柠檬与紫罗兰利口酒组成的花香型短饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 3, (select id from public.glassware where slug = 'coupe'), '可选马拉斯奇诺樱桃。', 'Serve up', 'shake', 240, 1, 2, 3, 1, 3, 22.00, 'published', now()),
  ('clover-club', 'Clover Club', '克洛弗俱乐部', '{}', 'A gin sour with raspberry and egg white for a soft, berry-led finish.', '金酒、覆盆子与蛋清构成的柔和酸酒，果香明显，口感细腻。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 3, (select id from public.glassware where slug = 'coupe'), '新鲜覆盆子。', 'Serve up', 'shake', 300, 1, 3, 3, 0, 3, 20.00, 'published', now()),
  ('moscow-mule', 'Moscow Mule', '莫斯科骡子', '{}', 'Vodka, ginger beer, and lime built long over a bright, spicy finish.', '伏特加、姜汁啤酒与青柠组成的长饮，气泡明亮，辛香清爽。', 'contemporary_classics', (select id from public.ingredients where slug = 'vodka'), 1, (select id from public.glassware where slug = 'mule-cup'), '青柠片。', 'Build over ice', 'build', 180, 1, 3, 2, 0, 2, 10.00, 'published', now()),
  ('french-75', 'French 75', '法国 75', '{}', 'Gin, lemon, sugar, and Champagne lifted into a bright sparkling classic.', '金酒、柠檬、糖浆与香槟组成的轻盈气泡型经典。', 'contemporary_classics', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'champagne-flute'), 'N/A', 'Serve up', 'shake', 240, 1, 2, 2, 0, 2, 12.00, 'published', now()),
  ('boulevardier', 'Boulevardier', '林荫大道', '{}', 'Bourbon or rye, Campari, and sweet vermouth in a bitter, spirit-forward classic.', '波本或黑麦威士忌、金巴利与甜味美思组成的苦味型经典，适合慢慢啜饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'bourbon'), 2, (select id from public.glassware where slug = 'coupe'), '橙皮，可选柠檬皮。', 'Ice cubes, serve up', 'stir', 180, 1, 3, 0, 4, 4, 25.00, 'published', now())
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
  published_at = excluded.published_at,
  updated_at = now();

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
    ('daiquiri', 'white-rum', 'base', 60.0, 'ml', '60 ml', 60.0, null, 1, false),
    ('daiquiri', 'lime-juice', 'modifier', 20.0, 'ml', '20 ml', 20.0, 'Freshly squeezed', 2, false),
    ('daiquiri', 'superfine-sugar', 'modifier', 2.0, 'bar_spoon', '2 bar spoons', null, null, 3, false),
    ('dry-martini', 'gin', 'base', 60.0, 'ml', '60 ml', 60.0, null, 1, false),
    ('dry-martini', 'dry-vermouth', 'modifier', 10.0, 'ml', '10 ml', 10.0, null, 2, false),
    ('manhattan', 'rye-whiskey', 'base', 50.0, 'ml', '50 ml', 50.0, null, 1, false),
    ('manhattan', 'sweet-vermouth', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 2, false),
    ('manhattan', 'angostura-bitters', 'modifier', 1.0, 'dash', '1 dash', null, null, 3, false),
    ('whiskey-sour', 'bourbon', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('whiskey-sour', 'lemon-juice', 'modifier', 25.0, 'ml', '25 ml', 25.0, 'Freshly squeezed', 2, false),
    ('whiskey-sour', 'simple-syrup', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 3, false),
    ('whiskey-sour', 'egg-white', 'modifier', null, 'optional', '少量（可选）', null, 'Few drops', 4, true),
    ('sidecar', 'cognac', 'base', 50.0, 'ml', '50 ml', 50.0, null, 1, false),
    ('sidecar', 'triple-sec', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 2, false),
    ('sidecar', 'lemon-juice', 'modifier', 20.0, 'ml', '20 ml', 20.0, 'Freshly squeezed', 3, false),
    ('aviation', 'gin', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('aviation', 'maraschino', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 2, false),
    ('aviation', 'lemon-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 3, false),
    ('aviation', 'creme-de-violette', 'modifier', 1.0, 'bar_spoon', '1 bar spoon', null, null, 4, false),
    ('clover-club', 'gin', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('clover-club', 'raspberry-syrup', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 2, false),
    ('clover-club', 'lemon-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 3, false),
    ('clover-club', 'egg-white', 'modifier', null, 'optional', '少量', null, 'Few drops', 4, true),
    ('moscow-mule', 'vodka', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('moscow-mule', 'ginger-beer', 'mixer', 120.0, 'ml', '120 ml', 120.0, null, 2, false),
    ('moscow-mule', 'lime-juice', 'modifier', 10.0, 'ml', '10 ml', 10.0, 'Freshly squeezed', 3, false),
    ('french-75', 'gin', 'base', 30.0, 'ml', '30 ml', 30.0, null, 1, false),
    ('french-75', 'lemon-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 2, false),
    ('french-75', 'simple-syrup', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 3, false),
    ('french-75', 'champagne', 'mixer', 60.0, 'ml', '60 ml', 60.0, null, 4, false),
    ('boulevardier', 'bourbon', 'base', 45.0, 'ml', '45 ml', 45.0, 'IBA allows Bourbon or Rye Whiskey', 1, false),
    ('boulevardier', 'campari', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 2, false),
    ('boulevardier', 'sweet-vermouth', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 3, false)
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
    ('daiquiri', 1, 'prepare', 'Add all ingredients to a shaker and stir to dissolve the sugar.', '将全部原料加入摇壶，先搅拌使糖溶解。'),
    ('daiquiri', 2, 'shake', 'Add ice, shake, and strain into a chilled cocktail glass.', '加入冰块摇匀，滤入冰镇鸡尾酒杯。'),
    ('dry-martini', 1, 'stir', 'Pour all ingredients into a mixing glass with ice cubes and stir well.', '将全部原料倒入装有冰块的搅拌杯，充分搅拌。'),
    ('dry-martini', 2, 'strain', 'Strain into a chilled martini cocktail glass.', '滤入冰镇马天尼杯。'),
    ('manhattan', 1, 'stir', 'Pour all ingredients into a mixing glass with ice cubes.', '将全部原料倒入装有冰块的搅拌杯。'),
    ('manhattan', 2, 'strain', 'Stir well and strain into a chilled cocktail glass.', '充分搅拌，滤入冰镇鸡尾酒杯。'),
    ('whiskey-sour', 1, 'shake', 'Pour all ingredients into an ice-filled shaker and shake well.', '将全部原料倒入装有冰块的摇壶，充分摇匀。'),
    ('whiskey-sour', 2, 'strain', 'Strain into a cobbler glass, or over ice in an old fashioned glass.', '滤入考布勒杯；若加冰饮用，则滤入装有冰块的古典杯。'),
    ('whiskey-sour', 3, 'texture', 'If egg white is used, shake harder to release and incorporate the foam.', '如果加入蛋清，需要更用力摇匀，使泡沫充分释放并融合。'),
    ('sidecar', 1, 'shake', 'Pour all ingredients into a shaker, shake well with ice, and strain.', '将全部原料倒入摇壶，与冰块充分摇匀后过滤。'),
    ('sidecar', 2, 'serve', 'Serve in a chilled cocktail glass.', '盛入冰镇鸡尾酒杯。'),
    ('aviation', 1, 'shake', 'Add all ingredients to a cocktail shaker.', '将全部原料加入摇壶。'),
    ('aviation', 2, 'strain', 'Shake with cracked ice and strain into a chilled cocktail glass.', '加入碎冰摇匀，滤入冰镇鸡尾酒杯。'),
    ('clover-club', 1, 'shake', 'Pour all ingredients into a cocktail shaker and shake well with ice.', '将全部原料倒入摇壶，与冰块充分摇匀。'),
    ('clover-club', 2, 'strain', 'Strain into a chilled cocktail glass.', '滤入冰镇鸡尾酒杯。'),
    ('moscow-mule', 1, 'build', 'Combine vodka and ginger beer in a mule cup or rocks glass.', '在骡子杯或岩石杯中混合伏特加与姜汁啤酒。'),
    ('moscow-mule', 2, 'stir', 'Add lime juice and gently stir to combine.', '加入青柠汁，轻轻搅拌融合。'),
    ('french-75', 1, 'shake', 'Pour all ingredients except Champagne into a shaker and shake well.', '将香槟以外的全部原料倒入摇壶并充分摇匀。'),
    ('french-75', 2, 'strain', 'Strain into a Champagne flute.', '滤入香槟笛形杯。'),
    ('french-75', 3, 'top', 'Top up with Champagne and stir gently.', '补满香槟，再轻轻搅拌。'),
    ('boulevardier', 1, 'stir', 'Pour all ingredients into a mixing glass with ice cubes.', '将全部原料倒入装有冰块的搅拌杯。'),
    ('boulevardier', 2, 'strain', 'Stir well and strain into a chilled cocktail glass.', '充分搅拌，滤入冰镇鸡尾酒杯。')
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
  ('dry', 'Dry', '干爽', 'style'),
  ('floral', 'Floral', '花香', 'flavor'),
  ('berry', 'Berry', '莓果', 'flavor'),
  ('ginger', 'Ginger', '姜香', 'flavor')
on conflict (slug) do update
set
  label_en = excluded.label_en,
  label_zh = excluded.label_zh,
  type = excluded.type;

with tag_rows (recipe_slug, tag_slug) as (
  values
    ('daiquiri', 'sour'),
    ('daiquiri', 'citrus'),
    ('daiquiri', 'short-drink'),
    ('dry-martini', 'dry'),
    ('dry-martini', 'spirit-forward'),
    ('dry-martini', 'short-drink'),
    ('manhattan', 'spirit-forward'),
    ('manhattan', 'short-drink'),
    ('manhattan', 'slow-sipping'),
    ('whiskey-sour', 'sour'),
    ('whiskey-sour', 'citrus'),
    ('whiskey-sour', 'short-drink'),
    ('sidecar', 'sour'),
    ('sidecar', 'citrus'),
    ('sidecar', 'short-drink'),
    ('aviation', 'floral'),
    ('aviation', 'citrus'),
    ('aviation', 'short-drink'),
    ('clover-club', 'berry'),
    ('clover-club', 'citrus'),
    ('clover-club', 'short-drink'),
    ('moscow-mule', 'ginger'),
    ('moscow-mule', 'refreshing'),
    ('moscow-mule', 'long-drink'),
    ('french-75', 'citrus'),
    ('french-75', 'sparkling'),
    ('french-75', 'long-drink'),
    ('boulevardier', 'bitter'),
    ('boulevardier', 'spirit-forward'),
    ('boulevardier', 'short-drink'),
    ('boulevardier', 'slow-sipping')
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
    ('daiquiri', 'daiquiri', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/daiquiri/'),
    ('dry-martini', 'dry-martini', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/dry-martini/'),
    ('manhattan', 'manhattan', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/manhattan/'),
    ('whiskey-sour', 'whiskey-sour', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/whiskey-sour/'),
    ('sidecar', 'sidecar', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/sidecar/'),
    ('aviation', 'aviation', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/aviation/'),
    ('clover-club', 'clover-club', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/clover-club/'),
    ('moscow-mule', 'moscow-mule', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/moscow-mule/'),
    ('french-75', 'french-75', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/french-75/'),
    ('boulevardier', 'boulevardier', 'The Unforgettables', 'https://iba-world.com/iba-cocktail/boulevardier/')
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
  'Recipe facts referenced from the official IBA page. Source images and page copy are not imported.'
from source_rows v
join public.recipes r on r.slug = v.recipe_slug
on conflict (recipe_id, source_url) do update
set
  external_id = excluded.external_id,
  source_category = excluded.source_category,
  retrieved_at = now(),
  rights_note = excluded.rights_note;
