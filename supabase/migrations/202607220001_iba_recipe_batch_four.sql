-- Add ten IBA recipe records from the official cocktail pages.
-- Recipe facts are normalized into the existing catalog schema; source images and page copy are not imported.

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
  ('grenadine-syrup', 'Grenadine Syrup', '石榴糖浆', '{Grenadine}', 'sweetener', false, null, '#b52f44', '{fruity,sweet}'),
  ('grapefruit-juice', 'Fresh Grapefruit Juice', '新鲜葡萄柚汁', '{Grapefruit Juice}', 'citrus', false, null, '#f1a37d', '{citrus,bitter}'),
  ('ginger-ale', 'Ginger Ale', '姜汁汽水', '{Ginger Ale}', 'mixer', false, null, '#d8bb6b', '{ginger,spicy,sparkling}')
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
  ('hanky-panky', 'Hanky Panky', '汉基潘基', '{}', 'London dry gin, sweet red vermouth, and Fernet in a bitter herbal short drink.', '伦敦干金酒、甜味红味美思与菲奈特组成的草本苦味短饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'Orange zest', 'Ice cubes, serve up', 'stir', 240, 1, 2, 0, 4, 4, 25.00, 'published', now()),
  ('john-collins', 'John Collins', '约翰柯林斯', '{}', 'Gin, lemon, sugar, and soda in a bright, refreshing highball; use Old Tom Gin for Tom Collins.', '金酒、柠檬、糖浆与苏打水组成的清爽高球；汤姆柯林斯则使用老汤姆金酒。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 1, (select id from public.glassware where slug = 'highball'), 'Lemon slice and maraschino cherry', 'Ice cubes', 'build', 180, 1, 3, 3, 0, 2, 10.00, 'published', now()),
  ('last-word', 'Last Word', '最后一词', '{}', 'Gin, green Chartreuse, maraschino, and lime in an equal-parts herbal sour.', '金酒、绿色查特酒、马拉斯奇诺与青柠等量组成的草本酸酒。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'N/A', 'Ice cubes, serve up', 'shake', 240, 1, 2, 4, 2, 4, 23.00, 'published', now()),
  ('martinez', 'Martinez', '马丁内斯', '{}', 'London dry gin, sweet red vermouth, maraschino, and orange bitters in a dry aromatic short drink.', '伦敦干金酒、甜味红味美思、马拉斯奇诺与橙味苦精组成的干爽芳香短饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'Lemon zest', 'Ice cubes, serve up', 'stir', 240, 1, 2, 0, 3, 4, 25.00, 'published', now()),
  ('mary-pickford', 'Mary Pickford', '玛丽皮克福德', '{}', 'White rum, pineapple, maraschino, and grenadine in a tropical short drink.', '白朗姆、菠萝汁、马拉斯奇诺与石榴糖浆组成的热带短饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'white-rum'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'N/A', 'Ice cubes, serve up', 'shake', 240, 1, 3, 2, 0, 3, 17.00, 'published', now()),
  ('monkey-gland', 'Monkey Gland', '猴腺', '{}', 'Dry gin, orange, absinthe, and grenadine in a vivid citrus short drink.', '干金酒、橙汁、苦艾酒与石榴糖浆组成的明亮柑橘短饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'N/A', 'Ice cubes, serve up', 'shake', 240, 1, 3, 2, 1, 3, 18.00, 'published', now()),
  ('hemingway-special', 'Hemingway Special', '海明威特调', '{}', 'Rum, grapefruit, maraschino, and lime in a dry tropical sour.', '朗姆、葡萄柚汁、马拉斯奇诺与青柠组成的干爽热带酸酒。', 'contemporary_classics', (select id from public.ingredients where slug = 'white-rum'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'N/A', 'Ice cubes, serve up', 'shake', 240, 1, 1, 4, 1, 3, 18.00, 'published', now()),
  ('horses-neck', 'Horse''s Neck', '马颈', '{}', 'Cognac, ginger ale, and optional bitters in a long drink with a citrus spiral.', '干邑、姜汁汽水与可选苦精组成的柑橘长饮。', 'contemporary_classics', (select id from public.ingredients where slug = 'cognac'), 1, (select id from public.glassware where slug = 'highball'), 'Lemon spiral', 'Ice cubes', 'build', 180, 1, 2, 0, 1, 3, 12.00, 'published', now()),
  ('lemon-drop-martini', 'Lemon Drop Martini', '柠檬马天尼', '{}', 'Vodka, orange liqueur, and lemon in a clean, bright short sour.', '伏特加、橙味利口酒与柠檬汁组成的明亮清爽短饮酸酒。', 'contemporary_classics', (select id from public.ingredients where slug = 'vodka'), 1, (select id from public.glassware where slug = 'cocktail-glass'), 'N/A', 'Ice cubes, serve up', 'shake', 240, 1, 2, 4, 0, 3, 20.00, 'published', now()),
  ('long-island-iced-tea', 'Long Island Iced Tea', '长岛冰茶', '{}', 'Vodka, tequila, rum, gin, orange liqueur, lemon, sugar, and cola in a powerful highball.', '伏特加、龙舌兰、朗姆、金酒、橙味利口酒、柠檬、糖浆与可乐组成的高球。', 'contemporary_classics', (select id from public.ingredients where slug = 'vodka'), 1, (select id from public.glassware where slug = 'highball'), 'Optional lemon slice', 'Ice cubes', 'build', 180, 1, 3, 3, 0, 5, 22.00, 'published', now())
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
    ('hanky-panky', 'gin', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('hanky-panky', 'sweet-vermouth', 'modifier', 45.0, 'ml', '45 ml', 45.0, null, 2, false),
    ('hanky-panky', 'fernet-branca', 'modifier', 7.5, 'ml', '7.5 ml', 7.5, null, 3, false),
    ('john-collins', 'gin', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('john-collins', 'lemon-juice', 'modifier', 30.0, 'ml', '30 ml', 30.0, 'Freshly squeezed', 2, false),
    ('john-collins', 'simple-syrup', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 3, false),
    ('john-collins', 'soda-water', 'mixer', 60.0, 'ml', '60 ml', 60.0, null, 4, false),
    ('last-word', 'gin', 'base', 22.5, 'ml', '22.5 ml', 22.5, null, 1, false),
    ('last-word', 'green-chartreuse', 'modifier', 22.5, 'ml', '22.5 ml', 22.5, null, 2, false),
    ('last-word', 'maraschino', 'modifier', 22.5, 'ml', '22.5 ml', 22.5, null, 3, false),
    ('last-word', 'lime-juice', 'modifier', 22.5, 'ml', '22.5 ml', 22.5, 'Freshly squeezed', 4, false),
    ('martinez', 'gin', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('martinez', 'sweet-vermouth', 'modifier', 45.0, 'ml', '45 ml', 45.0, null, 2, false),
    ('martinez', 'maraschino', 'modifier', 1.0, 'bar_spoon', '1 bar spoon', null, null, 3, false),
    ('martinez', 'orange-bitters', 'modifier', 2.0, 'dash', '2 dashes', null, null, 4, false),
    ('mary-pickford', 'white-rum', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('mary-pickford', 'pineapple-juice', 'modifier', 45.0, 'ml', '45 ml', 45.0, null, 2, false),
    ('mary-pickford', 'maraschino', 'modifier', 7.5, 'ml', '7.5 ml', 7.5, null, 3, false),
    ('mary-pickford', 'grenadine-syrup', 'modifier', 5.0, 'ml', '5 ml', 5.0, null, 4, false),
    ('monkey-gland', 'gin', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('monkey-gland', 'orange-juice', 'modifier', 45.0, 'ml', '45 ml', 45.0, null, 2, false),
    ('monkey-gland', 'absinthe', 'modifier', 1.0, 'tablespoon', '1 tablespoon', null, null, 3, false),
    ('monkey-gland', 'grenadine-syrup', 'modifier', 1.0, 'tablespoon', '1 tablespoon', null, null, 4, false),
    ('hemingway-special', 'white-rum', 'base', 60.0, 'ml', '60 ml', 60.0, null, 1, false),
    ('hemingway-special', 'grapefruit-juice', 'modifier', 40.0, 'ml', '40 ml', 40.0, null, 2, false),
    ('hemingway-special', 'maraschino', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 3, false),
    ('hemingway-special', 'lime-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 4, false),
    ('horses-neck', 'cognac', 'base', 40.0, 'ml', '40 ml', 40.0, null, 1, false),
    ('horses-neck', 'ginger-ale', 'mixer', 120.0, 'ml', '120 ml', 120.0, null, 2, false),
    ('horses-neck', 'angostura-bitters', 'modifier', 1.0, 'dash', '1 dash', null, 'Optional', 3, true),
    ('lemon-drop-martini', 'vodka', 'base', 30.0, 'ml', '30 ml', 30.0, null, 1, false),
    ('lemon-drop-martini', 'triple-sec', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 2, false),
    ('lemon-drop-martini', 'lemon-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 3, false),
    ('long-island-iced-tea', 'vodka', 'base', 15.0, 'ml', '15 ml', 15.0, null, 1, false),
    ('long-island-iced-tea', 'tequila-blanco', 'base', 15.0, 'ml', '15 ml', 15.0, null, 2, false),
    ('long-island-iced-tea', 'white-rum', 'base', 15.0, 'ml', '15 ml', 15.0, null, 3, false),
    ('long-island-iced-tea', 'gin', 'base', 15.0, 'ml', '15 ml', 15.0, null, 4, false),
    ('long-island-iced-tea', 'cointreau', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 5, false),
    ('long-island-iced-tea', 'lemon-juice', 'modifier', 25.0, 'ml', '25 ml', 25.0, 'Freshly squeezed', 6, false),
    ('long-island-iced-tea', 'simple-syrup', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 7, false),
    ('long-island-iced-tea', 'cola', 'mixer', null, 'top', 'Top with Cola', null, null, 8, false)
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
    ('hanky-panky', 1, 'stir', 'Pour all ingredients into a mixing glass with ice cubes and stir well.', '将全部原料倒入加冰搅拌杯中充分搅拌。'),
    ('hanky-panky', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('hanky-panky', 3, 'garnish', 'Garnish with orange zest.', '用橙皮屑装饰。'),
    ('john-collins', 1, 'build', 'Pour all ingredients directly into an ice-filled highball glass.', '将全部原料直接倒入装冰的海波杯。'),
    ('john-collins', 2, 'stir', 'Stir gently.', '轻轻搅拌。'),
    ('john-collins', 3, 'note', 'Use Old Tom Gin for Tom Collins.', '制作汤姆柯林斯时使用老汤姆金酒。'),
    ('john-collins', 4, 'garnish', 'Garnish with a lemon slice and maraschino cherry.', '用柠檬片与马拉斯奇诺樱桃装饰。'),
    ('last-word', 1, 'shake', 'Add all ingredients to a cocktail shaker.', '将全部原料加入摇壶。'),
    ('last-word', 2, 'strain', 'Shake with ice and strain into a chilled cocktail glass.', '加冰摇和，过滤入冰镇鸡尾酒杯。'),
    ('martinez', 1, 'stir', 'Pour all ingredients into a mixing glass with ice cubes.', '将全部原料倒入加冰搅拌杯。'),
    ('martinez', 2, 'strain', 'Stir well and strain into a chilled cocktail glass.', '充分搅拌后过滤入冰镇鸡尾酒杯。'),
    ('martinez', 3, 'garnish', 'Garnish with lemon zest.', '用柠檬皮屑装饰。'),
    ('mary-pickford', 1, 'shake', 'Pour all ingredients into a cocktail shaker and shake well with ice.', '将全部原料倒入摇壶，加冰充分摇和。'),
    ('mary-pickford', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('monkey-gland', 1, 'shake', 'Pour all ingredients into a cocktail shaker and shake well with ice.', '将全部原料倒入摇壶，加冰充分摇和。'),
    ('monkey-gland', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('hemingway-special', 1, 'shake', 'Pour all ingredients into a shaker with ice.', '将全部原料与冰加入摇壶。'),
    ('hemingway-special', 2, 'shake', 'Shake well and strain into a large cocktail glass.', '充分摇和后过滤入大号鸡尾酒杯。'),
    ('horses-neck', 1, 'build', 'Pour Cognac and ginger ale directly into an ice-filled highball glass.', '将干邑与姜汁汽水直接倒入装冰的海波杯。'),
    ('horses-neck', 2, 'stir', 'Stir gently.', '轻轻搅拌。'),
    ('horses-neck', 3, 'note', 'Add dashes of Angostura bitters if preferred.', '可按喜好加入安哥斯图拉苦精。'),
    ('horses-neck', 4, 'garnish', 'Garnish with a lemon rind spiral.', '用柠檬皮螺旋装饰。'),
    ('lemon-drop-martini', 1, 'shake', 'Pour all ingredients into a shaker with ice.', '将全部原料与冰加入摇壶。'),
    ('lemon-drop-martini', 2, 'strain', 'Shake well and strain into a chilled cocktail glass.', '充分摇和后过滤入冰镇鸡尾酒杯。'),
    ('long-island-iced-tea', 1, 'build', 'Add all ingredients into an ice-filled highball glass.', '将全部原料加入装冰的海波杯。'),
    ('long-island-iced-tea', 2, 'stir', 'Stir gently.', '轻轻搅拌。'),
    ('long-island-iced-tea', 3, 'garnish', 'Optionally garnish with a lemon slice.', '可选用柠檬片装饰。')
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

with tag_rows (recipe_slug, tag_slug) as (
  values
    ('hanky-panky', 'bitter'),
    ('hanky-panky', 'herbal'),
    ('hanky-panky', 'spirit-forward'),
    ('hanky-panky', 'short-drink'),
    ('john-collins', 'citrus'),
    ('john-collins', 'refreshing'),
    ('john-collins', 'long-drink'),
    ('last-word', 'herbal'),
    ('last-word', 'sour'),
    ('last-word', 'spirit-forward'),
    ('last-word', 'short-drink'),
    ('martinez', 'bitter'),
    ('martinez', 'dry'),
    ('martinez', 'spirit-forward'),
    ('martinez', 'short-drink'),
    ('mary-pickford', 'tropical'),
    ('mary-pickford', 'fruity'),
    ('mary-pickford', 'short-drink'),
    ('monkey-gland', 'citrus'),
    ('monkey-gland', 'fruity'),
    ('monkey-gland', 'spirit-forward'),
    ('monkey-gland', 'short-drink'),
    ('hemingway-special', 'citrus'),
    ('hemingway-special', 'tropical'),
    ('hemingway-special', 'sour'),
    ('hemingway-special', 'short-drink'),
    ('horses-neck', 'ginger'),
    ('horses-neck', 'refreshing'),
    ('horses-neck', 'long-drink'),
    ('lemon-drop-martini', 'citrus'),
    ('lemon-drop-martini', 'sour'),
    ('lemon-drop-martini', 'short-drink'),
    ('long-island-iced-tea', 'citrus'),
    ('long-island-iced-tea', 'spirit-forward'),
    ('long-island-iced-tea', 'long-drink')
)
insert into public.recipe_tags (recipe_id, tag_id)
select r.id, t.id
from tag_rows v
join public.recipes r on r.slug = v.recipe_slug
join public.tags t on t.slug = v.tag_slug
on conflict (recipe_id, tag_id) do nothing;

with source_rows (recipe_slug, external_id, source_category, source_url) as (
  values
    ('hanky-panky', 'hanky-panky', 'The unforgettables', 'https://iba-world.com/iba-cocktail/hanky-panky/'),
    ('john-collins', 'john-collins', 'The unforgettables', 'https://iba-world.com/iba-cocktail/john-collins/'),
    ('last-word', 'last-word', 'The unforgettables', 'https://iba-world.com/iba-cocktail/last-word/'),
    ('martinez', 'martinez', 'The unforgettables', 'https://iba-world.com/iba-cocktail/martinez/'),
    ('mary-pickford', 'mary-pickford', 'The unforgettables', 'https://iba-world.com/iba-cocktail/mary-pickford/'),
    ('monkey-gland', 'monkey-gland', 'The unforgettables', 'https://iba-world.com/iba-cocktail/monkey-gland/'),
    ('hemingway-special', 'hemingway-special', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/hemingway-special/'),
    ('horses-neck', 'horses-neck', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/horses-neck/'),
    ('lemon-drop-martini', 'lemon-drop-martini', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/lemon-drop-martini/'),
    ('long-island-iced-tea', 'long-island-iced-tea', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/long-island-iced-tea/')
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
