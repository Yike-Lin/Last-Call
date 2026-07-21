-- Add twenty more IBA recipes from the official cocktail list.

insert into public.glassware (slug, name_en, name_zh, capacity_ml)
values
  ('copo-glass', 'Copo Glass', '高脚鸡尾酒杯', 300)
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
  ('cachaca', 'Cachaca', '卡沙萨', '{Brazilian Cane Spirit}', 'base-spirit', true, 40.00, '#f1eee5', '{sugarcane,fruity}'),
  ('lime', 'Fresh Lime', '青柠', '{Lime Wedge}', 'citrus', false, null, '#b8d86a', '{citrus,acid}'),
  ('white-cane-sugar', 'White Cane Sugar', '白蔗糖', '{Cane Sugar}', 'sweetener', false, null, '#f0e7cc', '{sweet}'),
  ('cuban-aguardiente', 'Cuban Aguardiente', '古巴甘蔗烈酒', '{Cuban Cane Spirit}', 'base-spirit', true, 40.00, '#d9c19a', '{sugarcane,spirit-forward}'),
  ('raw-honey', 'Raw Honey', '生蜂蜜', '{Honey}', 'sweetener', false, null, '#d8a748', '{honey,sweet}'),
  ('water', 'Water', '水', '{}', 'mixer', false, null, '#dce8ea', '{neutral}'),
  ('old-tom-gin', 'Old Tom Gin', '老汤姆金酒', '{Old Tom}', 'base-spirit', true, 40.00, '#e4e8df', '{juniper,sweet}'),
  ('orange-bitters', 'Orange Bitters', '橙味苦精', '{Orange Bitters}', 'bitters', true, 28.00, '#d98232', '{orange,bitter}'),
  ('sugar-cube', 'Sugar Cube', '方糖', '{Sugar}', 'sweetener', false, null, '#efe7d1', '{sweet}'),
  ('grand-marnier', 'Grand Marnier', '金万利', '{Orange Cognac Liqueur}', 'liqueur', true, 40.00, '#c9752e', '{orange,oak}'),
  ('green-chartreuse', 'Green Chartreuse', '绿色查特酒', '{Chartreuse Verte}', 'liqueur', true, 55.00, '#7d9b4c', '{herbal,spiced}'),
  ('pineapple-juice', 'Fresh Pineapple Juice', '新鲜菠萝汁', '{Pineapple Juice}', 'fruit', false, null, '#edc95a', '{tropical,fruity,sweet}'),
  ('falernum', 'Falernum', '法勒南姆', '{Falernum Syrup}', 'liqueur', true, 11.00, '#d8b978', '{spiced,sweet}'),
  ('cointreau', 'Cointreau', '君度橙酒', '{Orange Liqueur}', 'liqueur', true, 40.00, '#e3a34d', '{orange,citrus}'),
  ('lillet-blanc', 'Lillet Blanc', '莉蕾白味美思', '{Lillet Blanc}', 'fortified-wine', true, 17.00, '#e8dfc1', '{dry,fruity}'),
  ('absinthe', 'Absinthe', '苦艾酒', '{Absinthe}', 'liqueur', true, 55.00, '#9bad72', '{herbal,anise}'),
  ('vodka-citron', 'Vodka Citron', '柠檬伏特加', '{Citron Vodka}', 'base-spirit', true, 40.00, '#eef2f4', '{citrus,clean}'),
  ('cranberry-juice', 'Cranberry Juice', '蔓越莓汁', '{Cranberry Juice}', 'fruit', false, null, '#b94458', '{berry,sour}'),
  ('cola', 'Cola', '可乐', '{Cola}', 'mixer', false, null, '#5b3328', '{caramel,sweet}'),
  ('goslings-rum', 'Goslings Rum', 'Goslings 黑朗姆', '{Dark Rum}', 'base-spirit', true, 40.00, '#5b3026', '{molasses,spice}'),
  ('gold-jamaican-rum', 'Gold Jamaican Rum', '金色牙买加朗姆', '{Jamaican Gold Rum}', 'base-spirit', true, 40.00, '#b9783d', '{tropical,spice}'),
  ('cuban-rum', 'Cuban Rum', '古巴朗姆', '{Cuban Rum}', 'base-spirit', true, 40.00, '#d2b17c', '{sugarcane,light}'),
  ('passion-fruit-syrup', 'Passion Fruit Syrup', '百香果糖浆', '{Passion Fruit Cordial}', 'sweetener', false, null, '#e5a143', '{tropical,sour,sweet}'),
  ('kahlua', 'Kahlua', '甘露咖啡利口酒', '{Coffee Liqueur}', 'liqueur', true, 20.00, '#4a2c25', '{coffee,sweet}'),
  ('espresso', 'Espresso', '浓缩咖啡', '{Strong Espresso}', 'mixer', false, null, '#3a2922', '{coffee,bitter}'),
  ('fernet-branca', 'Fernet Branca', '菲奈特布兰卡', '{Fernet}', 'amaro', true, 39.00, '#3d2b24', '{bitter,herbal}'),
  ('amaretto', 'Amaretto', '杏仁利口酒', '{Almond Liqueur}', 'liqueur', true, 28.00, '#a75e31', '{almond,sweet}'),
  ('raspberry-liqueur', 'Raspberry Liqueur', '覆盆子利口酒', '{Framboise Liqueur}', 'liqueur', true, 20.00, '#b84355', '{berry,fruity}'),
  ('basil', 'Italian Basil', '意大利罗勒', '{Basil Leaves}', 'herb', false, null, '#6f9c57', '{herbal,fresh}'),
  ('creme-de-cacao-white', 'Creme de Cacao (White)', '白色可可利口酒', '{White Creme de Cacao}', 'liqueur', true, 20.00, '#eee5d1', '{cacao,sweet}'),
  ('creme-de-menthe-green', 'Creme de Menthe (Green)', '绿色薄荷利口酒', '{Green Mint Liqueur}', 'liqueur', true, 20.00, '#6aa26d', '{mint,sweet}')
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
  ('caipirinha', 'Caipirinha', '凯匹林纳', '{}', 'Cachaca, lime, and cane sugar muddled over cracked ice.', '卡沙萨、青柠与蔗糖组成的巴西经典碎冰酒。', 'contemporary_classics', (select id from public.ingredients where slug = 'cachaca'), 2, (select id from public.glassware where slug = 'old-fashioned'), 'N/A', 'Cracked ice', 'build', 240, 1, 3, 3, 0, 3, 20.00, 'published', now()),
  ('canchanchara', 'Canchanchara', '坎昌查拉', '{}', 'Cuban aguardiente, lime, raw honey, and water in a bright long drink.', '古巴甘蔗烈酒、青柠、生蜂蜜与水组成的明亮长饮。', 'new_era', (select id from public.ingredients where slug = 'cuban-aguardiente'), 2, (select id from public.glassware where slug = 'old-fashioned'), 'Lime wedge', 'Cracked ice', 'build', 240, 1, 3, 3, 0, 3, 18.00, 'published', now()),
  ('cardinale', 'Cardinale', '卡迪纳莱', '{}', 'Gin, dry vermouth, and Campari in a dry bitter short drink.', '金酒、干味美思与金巴利组成的干爽苦味短饮。', 'contemporary_classics', (select id from public.ingredients where slug = 'gin'), 1, (select id from public.glassware where slug = 'cocktail-glass'), 'Lemon zest', 'Ice cubes, serve up', 'stir', 180, 1, 1, 0, 4, 4, 27.00, 'published', now()),
  ('casino', 'Casino', '卡西诺', '{}', 'Old Tom gin, maraschino, lemon, and orange bitters in a bright short drink.', '老汤姆金酒、马拉斯奇诺、柠檬与橙味苦精组成的明亮短饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'old-tom-gin'), 2, (select id from public.glassware where slug = 'old-fashioned'), 'Lemon zest and a maraschino cherry', 'Ice cubes, rocks', 'shake', 240, 1, 2, 3, 1, 3, 25.00, 'published', now()),
  ('champagne-cocktail', 'Champagne Cocktail', '香槟鸡尾酒', '{}', 'Chilled Champagne lifted with Cognac, bitters, sugar, and orange.', '冰镇香槟与干邑、苦精、方糖及橙香组成的气泡经典。', 'contemporary_classics', (select id from public.ingredients where slug = 'champagne'), 2, (select id from public.glassware where slug = 'champagne-flute'), 'Orange zest and a maraschino cherry', 'Serve up', 'build', 180, 1, 3, 0, 1, 2, 12.00, 'published', now()),
  ('chartreuse-swizzle', 'Chartreuse Swizzle', '夏特勒斯斯威泽', '{}', 'Green Chartreuse, pineapple, lime, and falernum swizzled over pebble ice.', '绿色查特酒、菠萝、青柠与法勒南姆组成的香草碎冰长饮。', 'new_era', (select id from public.ingredients where slug = 'green-chartreuse'), 2, (select id from public.glassware where slug = 'highball'), 'Mint leaves and grated nutmeg', 'Pebble ice', 'swizzle', 300, 1, 3, 3, 1, 3, 24.00, 'published', now()),
  ('corpse-reviver-2', 'Corpse Reviver #2', '死而复生二号', '{}', 'Gin, orange liqueur, Lillet Blanc, lemon, and absinthe in a precise sour.', '金酒、橙味利口酒、莉蕾白味美思、柠檬与苦艾酒组成的经典酸酒。', 'contemporary_classics', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'Orange zest', 'Ice cubes, serve up', 'shake', 240, 1, 2, 4, 1, 3, 24.00, 'published', now()),
  ('cosmopolitan', 'Cosmopolitan', '大都会', '{}', 'Citron vodka, orange liqueur, lime, and cranberry in a bright pink sour.', '柠檬伏特加、橙味利口酒、青柠与蔓越莓组成的明亮粉色酸酒。', 'contemporary_classics', (select id from public.ingredients where slug = 'vodka-citron'), 1, (select id from public.glassware where slug = 'cocktail-glass'), 'Lemon twist', 'Ice cubes, serve up', 'shake', 240, 1, 2, 3, 0, 3, 20.00, 'published', now()),
  ('cuba-libre', 'Cuba Libre', '自由古巴', '{}', 'White rum, cola, and lime built long over ice.', '白朗姆、可乐与青柠组成的清爽长饮。', 'contemporary_classics', (select id from public.ingredients where slug = 'white-rum'), 1, (select id from public.glassware where slug = 'highball'), 'Lime wedge', 'Ice cubes', 'build', 120, 1, 3, 2, 0, 2, 12.00, 'published', now()),
  ('dark-n-stormy', 'Dark ''N'' Stormy', '黑暗风暴', '{}', 'Dark rum floated over ginger beer in a spicy long drink.', '黑朗姆漂浮在姜汁啤酒上组成的辛香长饮。', 'new_era', (select id from public.ingredients where slug = 'goslings-rum'), 1, (select id from public.glassware where slug = 'highball'), 'Lime wedge or slice', 'Ice cubes', 'build', 120, 1, 2, 1, 1, 3, 16.00, 'published', now()),
  ('dons-special-daiquiri', 'Don''s Special Daiquiri', '唐恩特调得其利', '{}', 'Jamaican rum, Cuban rum, passion fruit, lime, and honey over crushed ice.', '牙买加朗姆、古巴朗姆、百香果、青柠与蜂蜜组成的热带碎冰酒。', 'new_era', (select id from public.ingredients where slug = 'gold-jamaican-rum'), 2, (select id from public.glassware where slug = 'copo-glass'), 'Half passion fruit', 'Crushed ice', 'blend', 300, 1, 3, 4, 0, 3, 20.00, 'published', now()),
  ('espresso-martini', 'Espresso Martini', '浓缩咖啡马天尼', '{}', 'Vodka, coffee liqueur, sugar, and espresso shaken cold.', '伏特加、咖啡利口酒、糖浆与浓缩咖啡组成的冷摇短饮。', 'new_era', (select id from public.ingredients where slug = 'vodka'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'Three coffee beans', 'Ice cubes, serve up', 'shake', 240, 1, 3, 0, 1, 4, 25.00, 'published', now()),
  ('fernandito', 'Fernandito', '费尔南迪托', '{}', 'Fernet Branca and cola in a simple bitter long drink.', '菲奈特布兰卡与可乐组成的简单苦味长饮。', 'new_era', (select id from public.ingredients where slug = 'fernet-branca'), 1, (select id from public.glassware where slug = 'old-fashioned'), 'N/A', 'Ice cubes', 'build', 120, 1, 2, 0, 4, 3, 18.00, 'published', now()),
  ('french-connection', 'French Connection', '法国贩毒网', '{}', 'Cognac and Amaretto stirred over ice in a spirit-forward classic.', '干邑与杏仁利口酒加冰搅拌的醇厚经典。', 'contemporary_classics', (select id from public.ingredients where slug = 'cognac'), 1, (select id from public.glassware where slug = 'old-fashioned'), 'N/A', 'Ice cubes', 'stir', 120, 1, 3, 0, 0, 5, 30.00, 'published', now()),
  ('french-martini', 'French Martini', '法国马天尼', '{}', 'Vodka, raspberry liqueur, and pineapple in a fruity short drink.', '伏特加、覆盆子利口酒与菠萝汁组成的果香短饮。', 'new_era', (select id from public.ingredients where slug = 'vodka'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'Lemon peel oil', 'Ice cubes, serve up', 'shake', 240, 1, 3, 1, 0, 3, 20.00, 'published', now()),
  ('garibaldi', 'Garibaldi', '加里波第', '{}', 'Campari and fresh orange juice built long over ice.', '金巴利与新鲜橙汁组成的明亮长饮。', 'contemporary_classics', (select id from public.ingredients where slug = 'campari'), 1, (select id from public.glassware where slug = 'highball'), 'Orange wedge', 'Ice cubes', 'build', 120, 1, 3, 1, 3, 2, 10.00, 'published', now()),
  ('gin-basil-smash', 'Gin Basil Smash', '金酒罗勒碎', '{}', 'Gin, lemon, sugar, and Italian basil shaken into a fresh herbal short drink.', '金酒、柠檬、糖浆与意大利罗勒组成的清新草本短饮。', 'new_era', (select id from public.ingredients where slug = 'gin'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'N/A', 'Ice cubes, serve up', 'shake', 300, 1, 3, 4, 0, 3, 20.00, 'published', now()),
  ('gin-fizz', 'Gin Fizz', '金菲士', '{}', 'Gin, lemon, sugar, and soda in a bright sparkling long drink.', '金酒、柠檬、糖浆与苏打水组成的明亮气泡长饮。', 'the_unforgettables', (select id from public.ingredients where slug = 'gin'), 1, (select id from public.glassware where slug = 'highball'), 'Lemon slice and optional zest', 'Serve up', 'shake', 240, 1, 2, 4, 0, 2, 12.00, 'published', now()),
  ('grand-margarita', 'Grand Margarita', '金万利玛格丽特', '{}', 'Agave tequila, Grand Marnier, and lime with a sea-salt rim.', '百分百龙舌兰、金万利与青柠组成的海盐边酸酒。', 'new_era', (select id from public.ingredients where slug = 'tequila-blanco'), 2, (select id from public.glassware where slug = 'old-fashioned'), 'Sea-salt rim and lime slice', 'Ice cubes, serve up', 'shake', 300, 1, 3, 4, 0, 4, 24.00, 'published', now()),
  ('grasshopper', 'Grasshopper', '蚱蜢', '{}', 'White cacao liqueur, green mint liqueur, and fresh cream in a cool dessert drink.', '白色可可利口酒、绿色薄荷利口酒与淡奶油组成的清凉甜点酒。', 'contemporary_classics', (select id from public.ingredients where slug = 'creme-de-cacao-white'), 2, (select id from public.glassware where slug = 'cocktail-glass'), 'Optional mint leaf', 'Ice cubes, serve up', 'shake', 240, 1, 3, 0, 0, 2, 14.00, 'published', now())
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
    ('caipirinha', 'cachaca', 'base', 60.0, 'ml', '60 ml', 60.0, null, 1, false),
    ('caipirinha', 'lime', 'modifier', 1.0, 'piece', '1 lime', null, 'Cut into small wedges', 2, false),
    ('caipirinha', 'white-cane-sugar', 'modifier', 4.0, 'teaspoon', '4 teaspoons', null, null, 3, false),
    ('canchanchara', 'cuban-aguardiente', 'base', 60.0, 'ml', '60 ml', 60.0, null, 1, false),
    ('canchanchara', 'lime-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 2, false),
    ('canchanchara', 'raw-honey', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 3, false),
    ('canchanchara', 'water', 'mixer', 50.0, 'ml', '50 ml', 50.0, null, 4, false),
    ('cardinale', 'gin', 'base', 40.0, 'ml', '40 ml', 40.0, null, 1, false),
    ('cardinale', 'dry-vermouth', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 2, false),
    ('cardinale', 'campari', 'modifier', 10.0, 'ml', '10 ml', 10.0, null, 3, false),
    ('casino', 'old-tom-gin', 'base', 40.0, 'ml', '40 ml', 40.0, null, 1, false),
    ('casino', 'maraschino', 'modifier', 10.0, 'ml', '10 ml', 10.0, null, 2, false),
    ('casino', 'lemon-juice', 'modifier', 10.0, 'ml', '10 ml', 10.0, 'Freshly squeezed', 3, false),
    ('casino', 'orange-bitters', 'modifier', 2.0, 'dash', '2 dashes', null, null, 4, false),
    ('champagne-cocktail', 'champagne', 'base', 90.0, 'ml', '90 ml', 90.0, 'Chilled', 1, false),
    ('champagne-cocktail', 'cognac', 'modifier', 10.0, 'ml', '10 ml', 10.0, null, 2, false),
    ('champagne-cocktail', 'angostura-bitters', 'modifier', 2.0, 'dash', '2 dashes', null, null, 3, false),
    ('champagne-cocktail', 'grand-marnier', 'modifier', null, 'optional', 'Few drops (optional)', null, null, 4, true),
    ('champagne-cocktail', 'sugar-cube', 'modifier', 1.0, 'piece', '1 sugar cube', null, null, 5, false),
    ('chartreuse-swizzle', 'green-chartreuse', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('chartreuse-swizzle', 'pineapple-juice', 'modifier', 30.0, 'ml', '30 ml', 30.0, 'Freshly squeezed', 2, false),
    ('chartreuse-swizzle', 'lime-juice', 'modifier', 22.5, 'ml', '22.5 ml', 22.5, 'Freshly squeezed', 3, false),
    ('chartreuse-swizzle', 'falernum', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 4, false),
    ('corpse-reviver-2', 'gin', 'base', 30.0, 'ml', '30 ml', 30.0, null, 1, false),
    ('corpse-reviver-2', 'cointreau', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 2, false),
    ('corpse-reviver-2', 'lillet-blanc', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 3, false),
    ('corpse-reviver-2', 'lemon-juice', 'modifier', 30.0, 'ml', '30 ml', 30.0, 'Freshly squeezed', 4, false),
    ('corpse-reviver-2', 'absinthe', 'modifier', 1.0, 'dash', '1 dash', null, null, 5, false),
    ('cosmopolitan', 'vodka-citron', 'base', 40.0, 'ml', '40 ml', 40.0, null, 1, false),
    ('cosmopolitan', 'cointreau', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 2, false),
    ('cosmopolitan', 'lime-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 3, false),
    ('cosmopolitan', 'cranberry-juice', 'mixer', 30.0, 'ml', '30 ml', 30.0, null, 4, false),
    ('cuba-libre', 'white-rum', 'base', 50.0, 'ml', '50 ml', 50.0, null, 1, false),
    ('cuba-libre', 'cola', 'mixer', 120.0, 'ml', '120 ml', 120.0, null, 2, false),
    ('cuba-libre', 'lime-juice', 'modifier', 10.0, 'ml', '10 ml', 10.0, 'Freshly squeezed', 3, false),
    ('dark-n-stormy', 'goslings-rum', 'base', 60.0, 'ml', '60 ml', 60.0, 'Float over the drink', 1, false),
    ('dark-n-stormy', 'ginger-beer', 'mixer', 100.0, 'ml', '100 ml', 100.0, null, 2, false),
    ('dons-special-daiquiri', 'gold-jamaican-rum', 'base', 30.0, 'ml', '30 ml', 30.0, null, 1, false),
    ('dons-special-daiquiri', 'cuban-rum', 'base', 15.0, 'ml', '15 ml', 15.0, null, 2, false),
    ('dons-special-daiquiri', 'passion-fruit-syrup', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 3, false),
    ('dons-special-daiquiri', 'lime-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 4, false),
    ('dons-special-daiquiri', 'honey-syrup', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 5, false),
    ('espresso-martini', 'vodka', 'base', 50.0, 'ml', '50 ml', 50.0, null, 1, false),
    ('espresso-martini', 'kahlua', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 2, false),
    ('espresso-martini', 'simple-syrup', 'modifier', 10.0, 'ml', '10 ml', 10.0, null, 3, false),
    ('espresso-martini', 'espresso', 'mixer', 1.0, 'shot', '1 strong espresso', null, null, 4, false),
    ('fernandito', 'fernet-branca', 'base', 50.0, 'ml', '50 ml', 50.0, null, 1, false),
    ('fernandito', 'cola', 'mixer', null, 'top_up', 'Fill up', null, null, 2, false),
    ('french-connection', 'cognac', 'base', 35.0, 'ml', '35 ml', 35.0, null, 1, false),
    ('french-connection', 'amaretto', 'modifier', 35.0, 'ml', '35 ml', 35.0, null, 2, false),
    ('french-martini', 'vodka', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('french-martini', 'raspberry-liqueur', 'modifier', 15.0, 'ml', '15 ml', 15.0, null, 2, false),
    ('french-martini', 'pineapple-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 3, false),
    ('garibaldi', 'campari', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('garibaldi', 'orange-juice', 'mixer', 120.0, 'ml', '120 ml', 120.0, 'Freshly squeezed', 2, false),
    ('gin-basil-smash', 'gin', 'base', 60.0, 'ml', '60 ml', 60.0, null, 1, false),
    ('gin-basil-smash', 'lemon-juice', 'modifier', 22.5, 'ml', '22.5 ml', 22.5, 'Freshly squeezed', 2, false),
    ('gin-basil-smash', 'simple-syrup', 'modifier', 22.5, 'ml', '22.5 ml', 22.5, null, 3, false),
    ('gin-basil-smash', 'basil', 'modifier', 10.0, 'piece', '10 basil leaves', null, 'Italian basil', 4, false),
    ('gin-fizz', 'gin', 'base', 45.0, 'ml', '45 ml', 45.0, null, 1, false),
    ('gin-fizz', 'lemon-juice', 'modifier', 30.0, 'ml', '30 ml', 30.0, 'Freshly squeezed', 2, false),
    ('gin-fizz', 'simple-syrup', 'modifier', 10.0, 'ml', '10 ml', 10.0, null, 3, false),
    ('gin-fizz', 'soda-water', 'mixer', null, 'splash', 'A splash', null, null, 4, false),
    ('grand-margarita', 'tequila-blanco', 'base', 45.0, 'ml', '45 ml', 45.0, '100% agave', 1, false),
    ('grand-margarita', 'grand-marnier', 'modifier', 30.0, 'ml', '30 ml', 30.0, null, 2, false),
    ('grand-margarita', 'lime-juice', 'modifier', 15.0, 'ml', '15 ml', 15.0, 'Freshly squeezed', 3, false),
    ('grasshopper', 'creme-de-cacao-white', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 1, false),
    ('grasshopper', 'creme-de-menthe-green', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 2, false),
    ('grasshopper', 'fresh-cream', 'modifier', 20.0, 'ml', '20 ml', 20.0, null, 3, false)
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

with step_rows (recipe_slug, step_number, action_type, instruction_en, instruction_zh) as (
  values
    ('caipirinha', 1, 'muddle', 'Muddle lime wedges and sugar gently in a double old fashioned glass.', '在古典杯中轻轻捣压青柠块与蔗糖。'),
    ('caipirinha', 2, 'build', 'Fill with cracked ice, add Cachaca, and stir gently.', '加满碎冰，加入卡沙萨并轻轻搅拌。'),
    ('caipirinha', 3, 'note', 'Optional variations use vodka, rum, or Licor Beirao instead of Cachaca.', '可选用伏特加、朗姆或 Licor Beirao 替代卡沙萨。'),
    ('canchanchara', 1, 'prepare', 'Mix honey, water, and lime juice and spread the mixture around the glass.', '混合蜂蜜、水与青柠汁，并将混合液铺在杯底和杯壁。'),
    ('canchanchara', 2, 'build', 'Add cracked ice and then the Cuban aguardiente.', '加入碎冰，再加入古巴甘蔗烈酒。'),
    ('canchanchara', 3, 'stir', 'Stir energetically from the bottom upward and finish with a lime wedge.', '从杯底向上有力搅拌，最后用青柠角装饰。'),
    ('cardinale', 1, 'stir', 'Stir gin, dry vermouth, and Campari with ice in a mixing glass.', '将金酒、干味美思与金巴利加冰在搅拌杯中搅拌。'),
    ('cardinale', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('cardinale', 3, 'garnish', 'Garnish with lemon zest.', '用柠檬皮屑装饰。'),
    ('casino', 1, 'shake', 'Shake all ingredients with ice in a cocktail shaker.', '将全部原料与冰在摇壶中摇和。'),
    ('casino', 2, 'strain', 'Strain into a chilled rocks glass with ice.', '过滤入装冰的冰岩杯。'),
    ('casino', 3, 'garnish', 'Garnish with lemon zest and a maraschino cherry.', '用柠檬皮屑与马拉斯奇诺樱桃装饰。'),
    ('champagne-cocktail', 1, 'build', 'Place the sugar cube and bitters in a Champagne glass, then add Cognac.', '将方糖与苦精放入香槟杯，再加入干邑。'),
    ('champagne-cocktail', 2, 'top', 'Pour in chilled Champagne gently.', '轻轻倒入冰镇香槟。'),
    ('champagne-cocktail', 3, 'garnish', 'Garnish with orange zest and a maraschino cherry.', '用橙皮屑与马拉斯奇诺樱桃装饰。'),
    ('chartreuse-swizzle', 1, 'build', 'Pour all ingredients into a tall glass and add pebble ice.', '将全部原料倒入高杯并加入鹅卵石冰。'),
    ('chartreuse-swizzle', 2, 'swizzle', 'Swizzle vigorously and fill the glass with more pebble ice.', '用搅拌棒有力旋转混合，再用更多鹅卵石冰填满杯子。'),
    ('chartreuse-swizzle', 3, 'garnish', 'Garnish with mint leaves and grated nutmeg.', '用薄荷叶与现磨肉豆蔻装饰。'),
    ('corpse-reviver-2', 1, 'shake', 'Shake gin, orange liqueur, Lillet Blanc, lemon, and absinthe with ice.', '将金酒、橙味利口酒、莉蕾白味美思、柠檬与苦艾酒加冰摇和。'),
    ('corpse-reviver-2', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('corpse-reviver-2', 3, 'garnish', 'Garnish with orange zest.', '用橙皮屑装饰。'),
    ('cosmopolitan', 1, 'shake', 'Shake all ingredients with ice in a cocktail shaker.', '将全部原料与冰在摇壶中摇和。'),
    ('cosmopolitan', 2, 'strain', 'Strain into a chilled large cocktail glass.', '过滤入冰镇大号鸡尾酒杯。'),
    ('cosmopolitan', 3, 'garnish', 'Garnish with a lemon twist.', '用柠檬皮扭饰装饰。'),
    ('cuba-libre', 1, 'build', 'Build rum, cola, and lime in an ice-filled highball glass.', '将朗姆、可乐与青柠倒入装冰的海波杯。'),
    ('cuba-libre', 2, 'garnish', 'Finish with a lime wedge.', '用青柠角完成装饰。'),
    ('dark-n-stormy', 1, 'build', 'Pour ginger beer into an ice-filled highball glass.', '将姜汁啤酒倒入装冰的海波杯。'),
    ('dark-n-stormy', 2, 'float', 'Float the dark rum over the top.', '将黑朗姆漂浮在顶部。'),
    ('dark-n-stormy', 3, 'garnish', 'Garnish with a lime wedge or slice.', '用青柠角或青柠片装饰。'),
    ('dons-special-daiquiri', 1, 'blend', 'Blend the rums, passion fruit syrup, lime, and honey with crushed ice.', '将两种朗姆、百香果糖浆、青柠与蜂蜜和碎冰搅打。'),
    ('dons-special-daiquiri', 2, 'serve', 'Pour into a footed copo glass and fill with more crushed ice.', '倒入高脚鸡尾酒杯，再用更多碎冰填满。'),
    ('dons-special-daiquiri', 3, 'garnish', 'Garnish with half a passion fruit.', '用半个百香果装饰。'),
    ('espresso-martini', 1, 'shake', 'Shake vodka, coffee liqueur, syrup, and espresso well with ice.', '将伏特加、咖啡利口酒、糖浆与浓缩咖啡加冰充分摇和。'),
    ('espresso-martini', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('espresso-martini', 3, 'garnish', 'Garnish with three coffee beans.', '用三颗咖啡豆装饰。'),
    ('fernandito', 1, 'build', 'Pour Fernet Branca into an ice-filled double old fashioned glass.', '将菲奈特布兰卡倒入装冰的古典杯。'),
    ('fernandito', 2, 'top', 'Fill with cola and stir gently.', '补满可乐并轻轻搅拌。'),
    ('french-connection', 1, 'build', 'Pour Cognac and Amaretto into an ice-filled old fashioned glass.', '将干邑与杏仁利口酒倒入装冰的古典杯。'),
    ('french-connection', 2, 'stir', 'Stir gently.', '轻轻搅拌。'),
    ('french-martini', 1, 'shake', 'Shake vodka, raspberry liqueur, and pineapple juice with ice.', '将伏特加、覆盆子利口酒与菠萝汁加冰摇和。'),
    ('french-martini', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('french-martini', 3, 'garnish', 'Express lemon peel oil over the drink.', '挤压柠檬皮，将香气油脂释放到酒液上。'),
    ('garibaldi', 1, 'build', 'Build Campari and fresh orange juice in an ice-filled highball glass.', '将金巴利与新鲜橙汁倒入装冰的海波杯。'),
    ('garibaldi', 2, 'garnish', 'Garnish with an orange wedge.', '用橙子角装饰。'),
    ('gin-basil-smash', 1, 'shake', 'Shake gin, lemon juice, syrup, and basil vigorously with ice.', '将金酒、柠檬汁、糖浆与罗勒加冰有力摇和。'),
    ('gin-basil-smash', 2, 'serve', 'Pour into a chilled cocktail glass.', '倒入冰镇鸡尾酒杯。'),
    ('gin-fizz', 1, 'shake', 'Shake gin, lemon juice, and syrup with ice, leaving out the soda.', '将金酒、柠檬汁与糖浆加冰摇和，先不加入苏打水。'),
    ('gin-fizz', 2, 'top', 'Pour into a tall tumbler and top with a splash of soda water.', '倒入高杯并补入少量苏打水。'),
    ('gin-fizz', 3, 'note', 'Serve without ice and garnish with a lemon slice.', '不加冰饮用，并用柠檬片装饰。'),
    ('grand-margarita', 1, 'prepare', 'Rim the rocks glass with sea salt and add ice to the glass and shaker.', '用海盐制作岩石杯盐边，并分别向杯子和摇壶中加入冰。'),
    ('grand-margarita', 2, 'shake', 'Shake the tequila, Grand Marnier, and lime hard for 10 seconds.', '将龙舌兰、金万利与青柠用力摇和 10 秒。'),
    ('grand-margarita', 3, 'strain', 'Strain into the prepared glass and garnish with a lime slice.', '过滤入准备好的杯子，并用青柠片装饰。'),
    ('grasshopper', 1, 'shake', 'Shake all ingredients briskly with ice.', '将全部原料与冰快速摇和。'),
    ('grasshopper', 2, 'strain', 'Strain into a chilled cocktail glass.', '过滤入冰镇鸡尾酒杯。'),
    ('grasshopper', 3, 'garnish', 'Optionally garnish with a mint leaf.', '可选用薄荷叶装饰。')
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
  ('tropical', 'Tropical', '热带', 'flavor')
on conflict (slug) do update
set
  label_en = excluded.label_en,
  label_zh = excluded.label_zh,
  type = excluded.type;

with tag_rows (recipe_slug, tag_slug) as (
  values
    ('caipirinha', 'sour'),
    ('caipirinha', 'refreshing'),
    ('caipirinha', 'long-drink'),
    ('canchanchara', 'sour'),
    ('canchanchara', 'honey'),
    ('canchanchara', 'refreshing'),
    ('canchanchara', 'long-drink'),
    ('cardinale', 'bitter'),
    ('cardinale', 'dry'),
    ('cardinale', 'spirit-forward'),
    ('cardinale', 'short-drink'),
    ('casino', 'citrus'),
    ('casino', 'fruity'),
    ('casino', 'short-drink'),
    ('champagne-cocktail', 'sparkling'),
    ('champagne-cocktail', 'citrus'),
    ('champagne-cocktail', 'short-drink'),
    ('chartreuse-swizzle', 'herbal'),
    ('chartreuse-swizzle', 'tropical'),
    ('chartreuse-swizzle', 'refreshing'),
    ('chartreuse-swizzle', 'long-drink'),
    ('corpse-reviver-2', 'citrus'),
    ('corpse-reviver-2', 'sour'),
    ('corpse-reviver-2', 'spirit-forward'),
    ('corpse-reviver-2', 'short-drink'),
    ('cosmopolitan', 'citrus'),
    ('cosmopolitan', 'fruity'),
    ('cosmopolitan', 'sour'),
    ('cosmopolitan', 'short-drink'),
    ('cuba-libre', 'citrus'),
    ('cuba-libre', 'refreshing'),
    ('cuba-libre', 'long-drink'),
    ('dark-n-stormy', 'ginger'),
    ('dark-n-stormy', 'refreshing'),
    ('dark-n-stormy', 'long-drink'),
    ('dons-special-daiquiri', 'tropical'),
    ('dons-special-daiquiri', 'sour'),
    ('dons-special-daiquiri', 'fruity'),
    ('dons-special-daiquiri', 'short-drink'),
    ('espresso-martini', 'coffee'),
    ('espresso-martini', 'spirit-forward'),
    ('espresso-martini', 'short-drink'),
    ('fernandito', 'bitter'),
    ('fernandito', 'refreshing'),
    ('fernandito', 'long-drink'),
    ('french-connection', 'spirit-forward'),
    ('french-connection', 'slow-sipping'),
    ('french-connection', 'short-drink'),
    ('french-martini', 'fruity'),
    ('french-martini', 'tropical'),
    ('french-martini', 'short-drink'),
    ('garibaldi', 'bitter'),
    ('garibaldi', 'citrus'),
    ('garibaldi', 'refreshing'),
    ('garibaldi', 'long-drink'),
    ('gin-basil-smash', 'herbal'),
    ('gin-basil-smash', 'citrus'),
    ('gin-basil-smash', 'short-drink'),
    ('gin-fizz', 'sour'),
    ('gin-fizz', 'citrus'),
    ('gin-fizz', 'refreshing'),
    ('gin-fizz', 'long-drink'),
    ('grand-margarita', 'sour'),
    ('grand-margarita', 'citrus'),
    ('grand-margarita', 'spirit-forward'),
    ('grand-margarita', 'short-drink'),
    ('grasshopper', 'creamy'),
    ('grasshopper', 'mint'),
    ('grasshopper', 'short-drink')
)
insert into public.recipe_tags (recipe_id, tag_id)
select r.id, t.id
from tag_rows v
join public.recipes r on r.slug = v.recipe_slug
join public.tags t on t.slug = v.tag_slug
on conflict (recipe_id, tag_id) do nothing;

with source_rows (recipe_slug, external_id, source_category, source_url) as (
  values
    ('caipirinha', 'caipirinha', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/caipirinha/'),
    ('canchanchara', 'canchanchara', 'New Era', 'https://iba-world.com/iba-cocktail/canchanchara/'),
    ('cardinale', 'cardinale', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/cardinale/'),
    ('casino', 'casino', 'The unforgettables', 'https://iba-world.com/iba-cocktail/casino/'),
    ('champagne-cocktail', 'champagne-cocktail', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/champagne-cocktail/'),
    ('chartreuse-swizzle', 'chartreuse-swizzle', 'New Era', 'https://iba-world.com/iba-cocktail/chartreuse-swizzle/'),
    ('corpse-reviver-2', 'corpse-reviver-2', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/corpse-reviver-2/'),
    ('cosmopolitan', 'cosmopolitan', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/cosmopolitan/'),
    ('cuba-libre', 'cuba-libre', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/cuba-libre/'),
    ('dark-n-stormy', 'dark-n-stormy', 'New Era', 'https://iba-world.com/iba-cocktail/dark-n-stormy/'),
    ('dons-special-daiquiri', 'dons-special-daiquiri', 'New Era', 'https://iba-world.com/iba-cocktail/dons-special-daiquiri/'),
    ('espresso-martini', 'espresso-martini', 'New Era', 'https://iba-world.com/iba-cocktail/espresso-martini/'),
    ('fernandito', 'fernandito', 'New Era', 'https://iba-world.com/iba-cocktail/fernandito/'),
    ('french-connection', 'french-connection', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/french-connection/'),
    ('french-martini', 'french-martini', 'New Era', 'https://iba-world.com/iba-cocktail/french-martini/'),
    ('garibaldi', 'garibaldi', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/garibaldi/'),
    ('gin-basil-smash', 'gin-basil-smash', 'New Era', 'https://iba-world.com/iba-cocktail/gin-basil-smash/'),
    ('gin-fizz', 'gin-fizz', 'The unforgettables', 'https://iba-world.com/iba-cocktail/gin-fizz/'),
    ('grand-margarita', 'grand-margarita', 'New Era', 'https://iba-world.com/iba-cocktail/grand-margarita/'),
    ('grasshopper', 'grasshopper', 'Contemporary Classics', 'https://iba-world.com/iba-cocktail/grasshopper/')
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
