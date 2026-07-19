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
