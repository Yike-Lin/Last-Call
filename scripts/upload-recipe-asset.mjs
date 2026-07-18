import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { createClient } from "@supabase/supabase-js";

const mimeTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"]
]);

function required(value, label) {
  if (!value) {
    throw new Error(`Missing ${label}.`);
  }

  return value;
}

function parsePositiveInteger(value, label) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }

  return parsed;
}

const [
  ,
  ,
  recipeSlug,
  localImagePath,
  storagePath = `${recipeSlug}/${basename(localImagePath ?? "")}`,
  altText = `${recipeSlug} cocktail image`,
  widthInput,
  heightInput,
  assetType = "thumbnail"
] = process.argv;

const supabaseUrl = required(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL"
);
const serviceRoleKey = required(
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  "SUPABASE_SERVICE_ROLE_KEY"
);
const bucket = process.env.RECIPE_IMAGES_BUCKET ?? "recipe-images";
const width = parsePositiveInteger(widthInput, "width");
const height = parsePositiveInteger(heightInput, "height");
const contentType = mimeTypes.get(extname(localImagePath ?? "").toLowerCase());

if (!contentType) {
  throw new Error("Only jpg, jpeg, png, and webp recipe images are supported.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false
  }
});

const image = await readFile(required(localImagePath, "local image path"));
const uploadResult = await supabase.storage.from(bucket).upload(storagePath, image, {
  contentType,
  upsert: true
});

if (uploadResult.error) {
  throw uploadResult.error;
}

const recipeResult = await supabase
  .from("recipes")
  .select("id")
  .eq("slug", required(recipeSlug, "recipe slug"))
  .single();

if (recipeResult.error) {
  throw recipeResult.error;
}

const demoteResult = await supabase
  .from("recipe_assets")
  .update({ is_primary: false })
  .eq("recipe_id", recipeResult.data.id)
  .eq("asset_type", assetType)
  .neq("storage_path", storagePath);

if (demoteResult.error) {
  throw demoteResult.error;
}

const assetResult = await supabase.from("recipe_assets").upsert(
  {
    recipe_id: recipeResult.data.id,
    asset_type: assetType,
    storage_path: storagePath,
    alt_text: altText,
    width,
    height,
    is_primary: true,
    sort_order: 0
  },
  { onConflict: "storage_path" }
);

if (assetResult.error) {
  throw assetResult.error;
}

const publicUrl = supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;

console.log(
  JSON.stringify(
    {
      recipeSlug,
      assetType,
      storagePath,
      publicUrl
    },
    null,
    2
  )
);
