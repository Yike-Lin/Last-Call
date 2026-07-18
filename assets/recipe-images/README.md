# Recipe Images

Local recipe images are working files. The website serves recipe images from Supabase Storage and stores only asset metadata in `public.recipe_assets`.

## Directories

- `source/`: original high-resolution exports or references. Not committed.
- `working/`: crops, edits, layered files, and experiments. Not committed.
- `upload/`: web-ready files prepared for Supabase Storage. Not committed.

Keep code, migrations, seed data, and upload scripts in Git. Keep image binaries in Storage or external backup unless a specific static image must ship with the app.

## Upload Example

```powershell
node scripts/upload-recipe-asset.mjs negroni "assets/recipe-images/upload/negroni-card.png" "negroni/card.png" "内格罗尼鸡尾酒，短杯盛装，红色酒液与橙皮装饰。" 2048 1600 thumbnail
```
