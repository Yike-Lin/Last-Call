insert into public.ingredients (slug, name, category, is_alcoholic, abv, color_hex, flavor_tags)
values
  ('gin', 'Gin', 'base-spirit', true, 40.00, '#f2f4f8', '{"juniper","dry"}'),
  ('campari', 'Campari', 'amaro', true, 24.00, '#c83d2f', '{"bitter","orange"}'),
  ('sweet-vermouth', 'Sweet Vermouth', 'fortified-wine', true, 16.00, '#8a4037', '{"herbal","sweet"}'),
  ('tequila-blanco', 'Tequila Blanco', 'base-spirit', true, 40.00, '#f0f4f8', '{"pepper","citrus"}'),
  ('triple-sec', 'Triple Sec', 'liqueur', true, 30.00, '#f2c66d', '{"orange","sweet"}'),
  ('lime-juice', 'Fresh Lime Juice', 'citrus', false, null, '#d2f19a', '{"citrus","acid"}'),
  ('white-rum', 'White Rum', 'base-spirit', true, 40.00, '#f5f7fa', '{"light","sugarcane"}'),
  ('simple-syrup', 'Simple Syrup', 'sweetener', false, null, '#efe6c8', '{"sweet"}'),
  ('mint', 'Mint', 'herb', false, null, '#65a56b', '{"mint","fresh"}'),
  ('soda-water', 'Soda Water', 'mixer', false, null, '#dbe8ff', '{"sparkling"}'),
  ('bourbon', 'Bourbon', 'base-spirit', true, 45.00, '#b96f36', '{"vanilla","oak"}'),
  ('angostura-bitters', 'Angostura Bitters', 'bitters', true, 44.70, '#7e3a27', '{"spice","bitter"}')
on conflict (slug) do nothing;

insert into public.recipes (
  slug,
  name,
  description,
  base_spirit,
  difficulty,
  glassware,
  garnish,
  method,
  instructions,
  flavor_tags,
  balance_sweet,
  balance_sour,
  balance_bitter,
  balance_spirit,
  estimated_abv
)
values
  (
    'negroni',
    'Negroni',
    'A bitter, spirit-forward classic with equal parts gin, Campari, and sweet vermouth.',
    'Gin',
    1,
    'Old Fashioned',
    'Orange peel',
    'Stir',
    '{"Fill the glass with ice.","Add gin, Campari, and sweet vermouth.","Stir until chilled.","Express orange peel and serve."}',
    '{"bitter","herbal","short"}',
    2,
    1,
    4,
    4,
    25.00
  ),
  (
    'margarita',
    'Margarita',
    'Bright citrus tension between tequila, orange liqueur, and fresh lime.',
    'Tequila',
    1,
    'Coupe',
    'Optional salt rim',
    'Shake',
    '{"Add ingredients to a shaker with ice.","Shake hard until cold.","Fine strain into a chilled coupe."}',
    '{"citrus","sharp","refreshing"}',
    2,
    4,
    1,
    3,
    21.00
  ),
  (
    'mojito',
    'Mojito',
    'A long, mint-driven highball with fresh lime and soda.',
    'Rum',
    2,
    'Highball',
    'Mint bouquet',
    'Build',
    '{"Lightly press mint with syrup and lime.","Add rum and ice.","Top with soda and lift gently."}',
    '{"mint","long","refreshing"}',
    3,
    3,
    0,
    2,
    11.00
  )
on conflict (slug) do nothing;
