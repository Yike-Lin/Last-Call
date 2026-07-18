# 配方图片

本地配方图片只作为工作文件和备份文件使用。网站正式展示的配方图片来自 Supabase Storage，数据库只在 `public.recipe_assets` 里保存图片路径和元信息。

## 目录说明

- `source/`：原始高清图、AI 生成原图、参考图或备份图。不提交到 Git。
- `upload/`：已经裁剪、压缩、命名好，准备上传到 Supabase Storage 的网页成品图。不提交到 Git。

代码、数据库迁移、seed 数据和上传脚本需要提交到 Git。图片二进制文件默认不要提交到 Git，正式资源放在 Supabase Storage，本地只保留必要备份。

## 上传示例

```powershell
node scripts/upload-recipe-asset.mjs negroni "assets/recipe-images/upload/negroni-card.png" "negroni/card.png" "内格罗尼鸡尾酒，短杯盛装，红色酒液与橙皮装饰。" 2048 1600 thumbnail
```
