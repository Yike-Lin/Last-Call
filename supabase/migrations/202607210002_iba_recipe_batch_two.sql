-- Add the next ten IBA recipes from the official cocktail list.

insert into public.glassware (slug, name_en, name_zh, capacity_ml)
values
  ('cocktail-glass', 'Cocktail Glass', '鸡尾酒杯', 180),
  ('slim-cocktail-glass', 'Slim Cocktail Glass', '细长鸡尾酒杯', 180)
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
  ('creme-de-cacao-brown', 'Creme de Cacao (Brown)', '棕色可可利口酒', '{Brown Creme de Cacao}', 'liqueur', true, 20.00, '#5b3026', '{cacao,creamy}'),
  ('fresh-cream', 'Fresh Cream', '淡奶油', '{Heavy Cream}', 'modifier', false, null, '#f4efe4', '{creamy}'),
  ('apricot-brandy', 'Apricot Brandy', '杏味白兰地', '{Apricot Liqueur}', 'liqueur', true, 24.00, '#d98b4a', '{apricot,fruity}'),
  ('calvados', 'Calvados', '苹果白兰地', '{Apple Brandy}', 'base-spirit', true, 40.00, '#c78b49', '{apple,oak}'),
  ('honey-syrup', 'Honey Syrup', '蜂蜜糖浆', '{Honey Mix}', 'sweetener', false, null, '#dcae54', '{honey,sweet}'),
  ('orange-juice', 'Fresh Orange Juice', '新鲜橙汁', '{Orange Juice}', 'citrus', false, null, '#f2a33a', '{citrus,sweet}'),
  ('prosecco', 'Prosecco', '普罗塞克', '{Italian Sparkling Wine}', 'sparkling-wine', true, 11.50, '#f1dda2', '{sparkling,fruity}'),
  ('white-peach-puree', 'White Peach Puree', '白桃泥', '{Peach Puree}', 'fruit', false, null, '#f2c5a7', '{peach,fruity,sweet}'),
  ('coffee-liqueur', 'Coffee Liqueur', '咖啡利口酒', '{Coffee Liqueur}', 'liqueur', true, 20.00, '#4a2c25', '{coffee,sweet}'),
  ('tomato-juice', 'Tomato Juice', '番茄汁', '{Tomato Juice}', 'mixer', false, null, '#c94a36', '{savory,refreshing}'),
  ('worcestershire-sauce', 'Worcestershire Sauce', '伍斯特沙司', '{Worcestershire}', 'modifier', false, null, '#5f3a24', '{savory,spiced}'),
  ('tabasco', 'Tabasco', '塔巴斯科辣椒酱', '{Hot Sauce}', 'modifier', false, null, '#b52f27', '{savory,spiced}'),
  ('celery-salt', 'Celery Salt', '芹菜盐', '{Celery Seasoning}', 'modifier', false, null, '#d9d0b1', '{savory}'),
  ('black-pepper', 'Black Pepper', '黑胡椒', '{Pepper}', 'modifier', false, null, '#3d3630', '{savory,spiced}'),
  ('creme-de-mure', 'Creme de Mure', '黑莓利口酒', '{Blackberry Liqueur}', 'liqueur', true, 16.00, '#542b43', '{berry,sweet}'),
  ('brandy', 'Brandy', '白兰地', '{Brandy}', 'base-spirit', true, 40.00, '#c48b4b', '{fruit,oak}'),
  ('curacao', 'Curacao', '库拉索利口酒', '{Orange Curacao}', 'liqueur', true, 30.00, '#e59b40', '{orange,sweet}')
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
  ('alexander', 'Alexander', '亚历山大', '{}', 'Cognac, brown cacao liqueur, and fresh cream in a soft dessert-style short drink.', '干邑、棕色可可利口酒与淡奶油组成的柔和甜点风短饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'cognac'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'Freshly grated nutmeg', 'Ice cubes, serve up', 'shake', 300, 1, 3, 0, 0, 3, 20.00, 'published', now()),
  ('americano', 'Americano', '阿美利加诺', '{}', 'Campari, sweet red vermouth, and soda water in a bright bittersweet aperitif.', '金巴利、甜味红味美思与苏打水组成的明亮苦甜开胃酒。', 'the_unforgettables', (select id from public.ingredients where slug = 'campari'), 1, (select id from public.glassware where slug = 'old-fashioned'), 'Half orange slice and lemon zest', 'Ice cubes, top with soda', 'build', 180, 1, 3, 0, 4, 2, 12.00, 'published', now()),
  ('angel-face', 'Angel Face', '天使之颜', '{}', 'Gin, apricot brandy, and Calvados in an equal-parts fruit-led short drink.', '金酒、杏味白兰地与苹果白兰地等量调和的果香短饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'N/A', 'Ice cubes, serve up', 'shake', 240, 1, 3, 0, 0, 4, 35.00, 'published', now()),
  ('bees-knees', 'Bee''s Knees', '蜂之膝', '{}', 'Gin, honey syrup, lemon, and orange in a bright citrus sour.', '金酒、蜂蜜糖浆、柠檬与橙汁组成的明亮柑橘酸酒。', 'new_era', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'Optional lemon or orange zest', 'Ice cubes, serve up', 'shake', 300, 1, 3, 4, 0, 2, 21.00, 'published', now()),
  ('bellini', 'Bellini', '贝里尼', '{}', 'Prosecco and white peach puree in a delicate sparkling aperitif.', '普罗塞克与白桃泥组成的轻盈气泡开胃酒。', 'contemporary_classics', (select id from public.ingredients where slug = 'prosecco'), 1, (select id from public.glassware where slug = 'champagne-flute'), 'N/A', 'Serve up', 'build', 180, 1, 3, 1, 0, 1, 8.00, 'published', now()),
  ('between-the-sheets', 'Between the Sheets', '床笫之间', '{}', 'White rum, Cognac, orange liqueur, and lemon in a dry-leaning sour.', '白朗姆、干邑、橙味利口酒与柠檬汁组成的紧致酸酒。', 'the_unforgettables', (select id from public.ingredients where slug = 'white-rum'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'N/A', 'Ice cubes, serve up', 'shake', 240, 1, 2, 4, 0, 4, 27.00, 'published', now()),
  ('black-russian', 'Black Russian', '黑俄罗斯', '{}', 'Vodka and coffee liqueur in a dark, spirit-forward after-dinner drink.', '伏特加与咖啡利口酒组成的深色餐后酒。', 'contemporary_classics', (select id from public.ingredients where slug = 'vodka'), 1, (select id from public.glassware where slug = 'old-fashioned'), 'N/A', 'Ice cubes', 'stir', 180, 1, 3, 0, 1, 4, 34.00, 'published', now()),
  ('bloody-mary', 'Bloody Mary', '血腥玛丽', '{}', 'Vodka, tomato, lemon, and savory seasonings in a customizable long drink.', '伏特加、番茄汁、柠檬汁与咸香调味组成的可定制长饮。', 'contemporary_classics', (select id from public.ingredients where slug = 'vodka'), 2, (select id from public.glassware where slug = 'old-fashioned'), 'Optional celery and lemon wedge', 'Ice cubes, serve up', 'stir', 240, 1, 0, 2, 0, 2, 12.00, 'published', now()),
  ('bramble', 'Bramble', '荆棘', '{}', 'Gin, lemon, sugar syrup, and blackberry liqueur over crushed ice.', '金酒、柠檬、糖浆与黑莓利口酒组成的碎冰长饮。', 'new_era', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'old-fashioned'), 'Optional lemon slice and blackberries', 'Crushed ice', 'shake', 300, 1, 3, 4, 0, 2, 26.00, 'published', now()),
  ('brandy-crusta', 'Brandy Crusta', '白兰地克鲁斯塔', '{}', 'Brandy, orange liqueur, lemon, syrup, and bitters with a sugared citrus rim.', '白兰地、橙味利口酒、柠檬、糖浆与苦精组成的糖边短饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'brandy'), 3, (select id from public.glassware where slug = 'slim-cocktail-glass'), 'Sugared rim and curled orange or lemon peel', 'Ice cubes, serve up', 'stir', 300, 1, 3, 4, 1, 3, 27.00, 'published', now())
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
    ('alexander', 'cognac', 'base', 30.0, 'ml', '30 ml', 30.0, null, 1, false),
    ('alexander', 'creme-de-cacao-brown', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 2, false),
    ('alexander', 'fresh-cream', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 3, false),
    ('americano', 'campari', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 1, false),
    ('americano', 'sweet-vermouth', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 2, false),
    ('americano', 'soda-water', 'mixer', null, 'splash', 'A splash', null, null, 3, false),
    ('angel-face', 'gin', 'base', 30.0, 'ml', '30 ml', 30.0, null, 1, false),
    ('angel-face', 'apricot-brandy', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 2, false),
    ('angel-face', 'calvados', 'base', 30.0, 'ml', '30 ml', 30.0, null, 3, false),
    ('bees-knees', 'gin', 'base', 52.5, 'ml', '52.5 ml', 52.5, null, 1, false),
    ('bees-knees', 'honey-syrup', 'modifier', 2.0, 'teaspoon', '2 teaspoons', null, null, 2, false),
    ('bees-knees', 'lemon-juice', 'modifier', 22.5, 'ml', '22.5 ml', 22.5, 'Freshly squeezed', 3, false),
    ('bees-knees', 'orange-juice', 'modifier', 22.5, 'ml', '22.5 ml', 22.5, 'Freshly squeezed', 4, false),
    ('bellini', 'prosecco', 'base', 100.0, 'ml', '100 ml', 100.0, null, 1, false),
    ('bellini', 'white-peach-puree', 'modifier', 50.0, 'ml', '50 ml', 50.0, null, 2, false),
    ('between-the-sheets', 'white-rum', 'base', 30.0, 'ml', '30 ml', 30.0, null, 1, false),
    ('between-the-sheets', 'cognac', 'base', 30.0, 'ml', '30 ml', 30.0, null, 2, false),
    ('between-the-sheets', 'triple-sec', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 3, false),
    ('between-the-sheets', 'lemon-juice', 'modifier', 20.0, 'ml', '20 ml', 20.0, 'Freshly squeezed', 4, false),
    ('black-russian', 'vodka', 'base', 50.0, 'ml', '50 ml', 50.0, null, 1, false),
    ('black-russian', 'coffee-liqueur', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 2, false),
    ('bloody-mary', 'vodka', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('bloody-mary', 'tomato-juice', 'mixer', 90.0, 'ml', '90 ml', 90.0, null, 2, false),
    ('bloody-mary', 'lemon-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 3, false),
    ('bloody-mary', 'worcestershire-sauce', 'modifier', 2.0, 'dash', '2 dashes', null, null, 4, false),
    ('bloody-mary', 'tabasco', 'modifier', null, 'to_taste', 'To taste', null, null, 5, false),
    ('bloody-mary', 'celery-salt', 'modifier', null, 'to_taste', 'To taste', null, null, 6, false),
    ('bloody-mary', 'black-pepper', 'modifier', null, 'to_taste', 'To taste', null, null, 7, false),
    ('bramble', 'gin', 'base', 50.0, 'ml', '50 ml', 50.0, null, 1, false),
    ('bramble', 'lemon-juice', 'modifier', 25.0, 'ml', '25 ml', 25.0, 'Freshly squeezed', 2, false),
    ('bramble', 'simple-syrup', 'modifier', 12.5, 'ml', '12.5 ml', 12.5, null, 3, false),
    ('bramble', 'creme-de-mure', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Add after straining', 4, false),
    ('brandy-crusta', 'brandy', 'base', 52.5, 'ml', '52.5 ml', 52.5, null, 1, false),
    ('brandy-crusta', 'maraschino', 'modifier', 7.5, 'ml', '7.5 ml', 7.5, null, 2, false),
    ('brandy-crusta', 'curacao', 'modifier', 1.0, 'bar_spoon', '1 bar spoon', null, null, 3, false),
    ('brandy-crusta', 'lemon-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 4, false),
    ('brandy-crusta', 'simple-syrup', 'modifier', 1.0, 'bar_spoon', '1 bar spoon', null, null, 5, false),
    ('brandy-crusta', 'angostura-bitters', 'modifier', 2.0, 'dash', '2 dashes', null, null, 6, false)
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
    ('alexander', 1, 'shake', 'Shake Cognac, brown creme de cacao, and fresh cream with ice.', '将干邑、棕色可可利口酒与淡奶油加冰摇和。'),
    ('alexander', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('alexander', 3, 'garnish', 'Dust with freshly grated nutmeg.', '撒上现磨肉豆蔻。'),
    ('americano', 1, 'build', 'Build Campari and sweet vermouth in an ice-filled old fashioned glass.', '将金巴利与甜味红味美思倒入装冰的古典杯。'),
    ('americano', 2, 'top', 'Add a splash of soda water and stir gently.', '加入少量苏打水并轻轻搅拌。'),
    ('americano', 3, 'garnish', 'Garnish with half an orange slice and lemon zest.', '用半片橙子与柠檬皮屑装饰。'),
    ('angel-face', 1, 'shake', 'Shake gin, apricot brandy, and Calvados with ice.', '将金酒、杏味白兰地与苹果白兰地加冰摇和。'),
    ('angel-face', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('bees-knees', 1, 'prepare', 'Stir honey syrup with lemon and orange juices until dissolved.', '将蜂蜜糖浆与柠檬汁、橙汁搅拌至溶解。'),
    ('bees-knees', 2, 'shake', 'Add gin, shake with ice, and strain into a chilled cocktail glass.', '加入金酒，加冰摇和后过滤入冰镇鸡尾酒杯。'),
    ('bees-knees', 3, 'garnish', 'Optionally garnish with lemon or orange zest.', '可选用柠檬或橙皮屑装饰。'),
    ('bellini', 1, 'build', 'Add peach puree to an ice-filled mixing glass and pour in Prosecco.', '将白桃泥加入装冰的搅拌杯，再倒入普罗塞克。'),
    ('bellini', 2, 'stir', 'Stir gently and pour into a chilled flute.', '轻轻搅拌后倒入冰镇香槟笛形杯。'),
    ('bellini', 3, 'note', 'Optional variations include Puccini with mandarin juice, Rossini with strawberry puree, and Tintoretto with pomegranate juice.', '可选变化包括以柑橘汁调制的 Puccini、以草莓泥调制的 Rossini，以及以石榴汁调制的 Tintoretto。'),
    ('between-the-sheets', 1, 'shake', 'Shake white rum, Cognac, orange liqueur, and lemon juice with ice.', '将白朗姆、干邑、橙味利口酒与柠檬汁加冰摇和。'),
    ('between-the-sheets', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('black-russian', 1, 'build', 'Pour vodka and coffee liqueur into an ice-filled old fashioned glass.', '将伏特加与咖啡利口酒倒入装冰的古典杯。'),
    ('black-russian', 2, 'stir', 'Stir gently.', '轻轻搅拌。'),
    ('black-russian', 3, 'note', 'For a White Russian, float fresh cream on top and stir it in slowly.', '如制作白俄罗斯，可在顶部漂浮淡奶油并慢慢搅入。'),
    ('bloody-mary', 1, 'stir', 'Stir vodka, tomato juice, lemon juice, sauces, celery salt, and pepper with ice.', '将伏特加、番茄汁、柠檬汁、调味酱、芹菜盐与胡椒加冰搅拌。'),
    ('bloody-mary', 2, 'serve', 'Pour into a rocks glass; use a highball glass when serving over ice.', '倒入岩石杯；加冰饮用时可使用海波杯。'),
    ('bloody-mary', 3, 'garnish', 'Optionally garnish with celery and a lemon wedge.', '可选用芹菜与柠檬角装饰。'),
    ('bramble', 1, 'shake', 'Shake gin, lemon juice, and sugar syrup with ice, leaving out the blackberry liqueur.', '将金酒、柠檬汁与糖浆加冰摇和，先不加入黑莓利口酒。'),
    ('bramble', 2, 'strain', 'Strain into an old fashioned glass filled with crushed ice.', '过滤入装满碎冰的古典杯。'),
    ('bramble', 3, 'float', 'Pour the blackberry liqueur over the drink in a circular motion.', '沿圆周动作将黑莓利口酒淋在酒液顶部。'),
    ('bramble', 4, 'garnish', 'Optionally garnish with a lemon slice and blackberries.', '可选用柠檬片与黑莓装饰。'),
    ('brandy-crusta', 1, 'prepare', 'Rub citrus around the rim and coat it with pulverized white sugar.', '用柑橘片擦拭杯口，再裹上细碎白砂糖。'),
    ('brandy-crusta', 2, 'stir', 'Stir brandy, liqueurs, lemon juice, syrup, and bitters with ice.', '将白兰地、利口酒、柠檬汁、糖浆与苦精加冰搅拌。'),
    ('brandy-crusta', 3, 'strain', 'Strain into the prepared slim cocktail glass.', '过滤入准备好的细长鸡尾酒杯。'),
    ('brandy-crusta', 4, 'garnish', 'Curl an orange or lemon peel around the inside of the glass.', '将橙皮或柠檬皮卷曲放入杯内。')
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
  ('creamy', 'Creamy', '奶油感', 'flavor'),
  ('honey', 'Honeyed', '蜂蜜', 'flavor'),
  ('peach', 'Peach', '桃香', 'flavor'),
  ('coffee', 'Coffee', '咖啡', 'flavor'),
  ('savory', 'Savory', '咸香', 'flavor'),
  ('spiced', 'Spiced', '辛香', 'flavor'),
  ('fruity', 'Fruity', '果香', 'flavor')
on conflict (slug) do update
set
  label_en = excluded.label_en,
  label_zh = excluded.label_zh,
  type = excluded.type;

with tag_rows (recipe_slug, tag_slug) as (
  values
    ('alexander', 'creamy'),
    ('alexander', 'short-drink'),
    ('americano', 'bitter'),
    ('americano', 'orange'),
    ('americano', 'refreshing'),
    ('americano', 'long-drink'),
    ('angel-face', 'fruity'),
    ('angel-face', 'spirit-forward'),
    ('angel-face', 'short-drink'),
    ('bees-knees', 'sour'),
    ('bees-knees', 'citrus'),
    ('bees-knees', 'honey'),
    ('bees-knees', 'short-drink'),
    ('bellini', 'sparkling'),
    ('bellini', 'peach'),
    ('bellini', 'refreshing'),
    ('bellini', 'long-drink'),
    ('between-the-sheets', 'sour'),
    ('between-the-sheets', 'citrus'),
    ('between-the-sheets', 'spirit-forward'),
    ('between-the-sheets', 'short-drink'),
    ('black-russian', 'coffee'),
    ('black-russian', 'spirit-forward'),
    ('black-russian', 'short-drink'),
    ('bloody-mary', 'savory'),
    ('bloody-mary', 'spiced'),
    ('bloody-mary', 'refreshing'),
    ('bloody-mary', 'long-drink'),
    ('bramble', 'berry'),
    ('bramble', 'citrus'),
    ('bramble', 'sour'),
    ('bramble', 'short-drink'),
    ('brandy-crusta', 'citrus'),
    ('brandy-crusta', 'spirit-forward'),
    ('brandy-crusta', 'short-drink')
)
insert into public.recipe_tags (recipe_id, tag_id)
select r.id, t.id
from tag_rows v
join public.recipes r on r.slug = v.recipe_slug
join public.tags t on t.slug = v.tag_slug
on conflict (recipe_id, tag_id) do nothing;

with source_rows (recipe_slug, external_id, source_category, source_url) as (
  values
    ('alexander', 'alexander', 'The unforgettables', 'https://iba-world.com/iba-cocktail/alexander/'),
    ('americano', 'americano', 'The unforgettables', 'https://iba-world.com/iba-cocktail/americano/'),
    ('angel-face', 'angel-face', 'The unforgettables', 'https://iba-world.com/iba-cocktail/angel-face/'),
    ('bees-knees', 'bees-knees', 'New Era', 'https://iba-world.com/iba-cocktail/bees-knees/'),
    ('bellini', 'bellini', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/bellini/'),
    ('between-the-sheets', 'between-the-sheets', 'The unforgettables', 'https://iba-world.com/iba-cocktail/between-the-sheets/'),
    ('black-russian', 'black-russian', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/black-russian/'),
    ('bloody-mary', 'bloody-mary', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/bloody-mary/'),
    ('bramble', 'bramble', 'New Era', 'https://iba-world.com/iba-cocktail/bramble/'),
    ('brandy-crusta', 'brandy-crusta', 'The unforgettables', 'https://iba-world.com/iba-cocktail/brandy-crusta/')
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
