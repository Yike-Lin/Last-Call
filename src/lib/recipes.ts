import "server-only";

import type { QueryData } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RecipeCard = {
  slug: string;
  name: string;
  baseSpirit: string;
  baseSpiritCategory: string;
  baseSpirits: RecipeBaseSpirit[];
  summary: string;
  tags: RecipeTag[];
  balance: {
    sweet: number;
    sour: number;
    bitter: number;
    spirit: number;
  };
  glassware: string;
  method: string;
  difficulty: string;
  estimatedAbv: string;
  garnish: string | null;
  iceStyle: string | null;
  prepTimeSeconds: number | null;
  servings: number;
  imageUrl: string | null;
  imageAlt: string | null;
  ingredients: Array<{
    slug: string;
    name: string;
    amount: string;
    role: string;
    preparationNote: string | null;
    isOptional: boolean;
  }>;
  steps: string[];
  detailedSteps: RecipeStep[];
};

export type RecipeStep = {
  stepNumber: number;
  actionType: string | null;
  instruction: string;
  durationSeconds: number | null;
};

export type RecipeBaseSpirit = {
  label: string;
  category: string;
  amountMl: number | null;
  ratio: number | null;
};

export type RecipeTag = {
  slug: string;
  label: string;
  type: string;
};

const recipeImagesBucket = "recipe-images";

const recipeSelect = `
  slug,
  name_en,
  name_zh,
  description_en,
  description_zh,
  difficulty,
  primary_method,
  estimated_abv,
  garnish_text,
  ice_style,
  prep_time_seconds,
  servings,
  balance_sweet,
  balance_sour,
  balance_bitter,
  balance_spirit,
  primary_spirit:ingredients!recipes_primary_spirit_id_fkey (
    slug,
    name_en,
    name_zh
  ),
  glassware:glassware!recipes_glassware_id_fkey (
    name_en,
    name_zh
  ),
  recipe_ingredients (
    role,
    amount_value,
    display_amount,
    normalized_ml,
    unit_code,
    preparation_note,
    sort_order,
    is_optional,
    ingredient:ingredients!recipe_ingredients_ingredient_id_fkey (
      slug,
      name_en,
      name_zh,
      category
    )
  ),
  recipe_steps (
    step_number,
    action_type,
    instruction_en,
    instruction_zh,
    duration_seconds
  ),
  recipe_tags (
    tags (
      slug,
      label_en,
      label_zh,
      type
    )
  ),
  recipe_assets (
    asset_type,
    storage_path,
    alt_text,
    width,
    height,
    is_primary,
    sort_order
  )
` as const;

function createPublishedRecipesQuery() {
  return createSupabaseServerClient()
    .from("recipes")
    .select(recipeSelect)
    .eq("status", "published");
}

type PublishedRecipeRow = QueryData<
  ReturnType<typeof createPublishedRecipesQuery>
>[number];

const difficultyLabels: Record<number, string> = {
  1: "简单",
  2: "中等",
  3: "进阶"
};

const methodLabels: Record<string, string> = {
  build: "直调",
  shake: "摇匀",
  stir: "搅拌"
};

const baseSpiritCategoryRules = [
  { label: "金酒", keywords: ["gin", "金酒", "杜松子"] },
  { label: "朗姆", keywords: ["rum", "朗姆"] },
  { label: "龙舌兰", keywords: ["tequila", "mezcal", "龙舌兰", "梅斯卡尔"] },
  { label: "伏特加", keywords: ["vodka", "伏特加"] },
  { label: "威士忌", keywords: ["whiskey", "whisky", "bourbon", "rye", "威士忌", "波本"] },
  { label: "白兰地", keywords: ["brandy", "cognac", "armagnac", "白兰地", "干邑"] }
];

function localizedValue(zh: string | null, en: string | null) {
  return zh?.trim() || en?.trim() || "待补充";
}

function bilingualName(zh: string | null, en: string) {
  return zh?.trim() ? `${zh.trim()} ${en}` : en;
}

function formatAmount(
  displayAmount: string | null,
  amountValue: number | null,
  unitCode: string
) {
  if (displayAmount?.trim()) {
    return displayAmount;
  }

  return amountValue === null ? unitCode : `${amountValue} ${unitCode}`;
}

function getRecipeImageUrl(storagePath: string | null) {
  if (!storagePath) {
    return null;
  }

  if (/^https?:\/\//i.test(storagePath)) {
    return storagePath;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

  if (!supabaseUrl) {
    return null;
  }

  const encodedPath = storagePath.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/${recipeImagesBucket}/${encodedPath}`;
}

function getBaseSpiritCategory(slug: string | null | undefined, label: string) {
  const source = `${slug ?? ""} ${label}`.toLocaleLowerCase();

  return (
    baseSpiritCategoryRules.find(({ keywords }) =>
      keywords.some((keyword) => source.includes(keyword.toLocaleLowerCase()))
    )?.label ?? "其他"
  );
}

function getIngredientAmountMl(
  normalizedMl: number | null,
  amountValue: number | null,
  unitCode: string
) {
  if (normalizedMl !== null) {
    return normalizedMl;
  }

  return unitCode === "ml" ? amountValue : null;
}

function getBaseSpiritRows(row: PublishedRecipeRow, fallbackLabel: string) {
  const spirits = [...row.recipe_ingredients]
    .filter(
      (item) =>
        item.role === "base" ||
        item.ingredient.category === "base-spirit"
    )
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => {
      const label = localizedValue(item.ingredient.name_zh, item.ingredient.name_en);

      return {
        label,
        category: getBaseSpiritCategory(item.ingredient.slug, label),
        amountMl: getIngredientAmountMl(
          item.normalized_ml,
          item.amount_value,
          item.unit_code
        ),
        sortOrder: item.sort_order
      };
    })
    .filter((spirit) => spirit.category !== "其他");

  const groupedSpirits = [...spirits]
    .reduce<Array<RecipeBaseSpirit & { sortOrder: number }>>((groups, spirit) => {
      const existing = groups.find((item) => item.category === spirit.category);

      if (existing) {
        existing.amountMl =
          existing.amountMl === null && spirit.amountMl === null
            ? null
            : (existing.amountMl ?? 0) + (spirit.amountMl ?? 0);
        existing.sortOrder = Math.min(existing.sortOrder, spirit.sortOrder);
        return groups;
      }

      groups.push({
        label: spirit.label,
        category: spirit.category,
        amountMl: spirit.amountMl,
        ratio: null,
        sortOrder: spirit.sortOrder
      });
      return groups;
    }, [])
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const totalKnownLiquidAmount = row.recipe_ingredients.reduce(
    (total, item) =>
      total +
      (getIngredientAmountMl(
        item.normalized_ml,
        item.amount_value,
        item.unit_code
      ) ?? 0),
    0
  );

  const uniqueSpirits = groupedSpirits
    .map((spirit) => ({
      label: spirit.label,
      category: spirit.category,
      amountMl: spirit.amountMl,
      ratio:
        totalKnownLiquidAmount > 0 && spirit.amountMl !== null
          ? spirit.amountMl / totalKnownLiquidAmount
          : groupedSpirits.length === 1
            ? 1
          : null
    }))
    .sort(
      (a, b) =>
        (b.ratio ?? 0) - (a.ratio ?? 0) ||
        (b.amountMl ?? 0) - (a.amountMl ?? 0)
    );

  if (uniqueSpirits.length > 0) {
    return uniqueSpirits;
  }

  return [
    {
      label: fallbackLabel,
      category: getBaseSpiritCategory(undefined, fallbackLabel),
      amountMl: null,
      ratio: 1
    }
  ].filter((spirit) => spirit.category !== "其他");
}

function mapRecipe(row: PublishedRecipeRow): RecipeCard {
  const primaryAsset =
    [...row.recipe_assets]
      .filter((asset) => asset.asset_type === "thumbnail" || asset.asset_type === "hero")
      .sort(
        (a, b) =>
          Number(b.is_primary) - Number(a.is_primary) ||
          a.sort_order - b.sort_order
      )[0] ?? null;

  const ingredients = [...row.recipe_ingredients]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      slug: item.ingredient.slug,
      name: localizedValue(item.ingredient.name_zh, item.ingredient.name_en),
      amount: formatAmount(
        item.display_amount,
        item.amount_value,
        item.unit_code
      ),
      role: item.role,
      preparationNote: item.preparation_note?.trim() || null,
      isOptional: item.is_optional
    }));

  const detailedSteps = [...row.recipe_steps]
    .sort((a, b) => a.step_number - b.step_number)
    .map((step) => ({
      stepNumber: step.step_number,
      actionType: step.action_type,
      instruction: localizedValue(step.instruction_zh, step.instruction_en),
      durationSeconds: step.duration_seconds
    }));

  const steps = detailedSteps.map((step) => step.instruction);

  const tags = row.recipe_tags.map(({ tags }) => ({
    slug: tags.slug,
    label: localizedValue(tags.label_zh, tags.label_en),
    type: tags.type
  }));

  const baseSpirit = row.primary_spirit
    ? localizedValue(row.primary_spirit.name_zh, row.primary_spirit.name_en)
    : "未分类";
  const baseSpiritCategory = getBaseSpiritCategory(row.primary_spirit?.slug, baseSpirit);
  const baseSpirits = getBaseSpiritRows(row, baseSpirit);

  return {
    slug: row.slug,
    name: bilingualName(row.name_zh, row.name_en),
    baseSpirit,
    baseSpiritCategory,
    baseSpirits,
    summary: localizedValue(row.description_zh, row.description_en),
    tags,
    balance: {
      sweet: row.balance_sweet,
      sour: row.balance_sour,
      bitter: row.balance_bitter,
      spirit: row.balance_spirit
    },
    glassware: row.glassware
      ? localizedValue(row.glassware.name_zh, row.glassware.name_en)
      : "待确认",
    method: methodLabels[row.primary_method] ?? row.primary_method,
    difficulty: difficultyLabels[row.difficulty] ?? "待评估",
    estimatedAbv:
      row.estimated_abv === null ? "待测算" : `约 ${row.estimated_abv}%`,
    garnish: row.garnish_text?.trim() || null,
    iceStyle: row.ice_style?.trim() || null,
    prepTimeSeconds: row.prep_time_seconds,
    servings: Number(row.servings),
    imageUrl: getRecipeImageUrl(primaryAsset?.storage_path ?? null),
    imageAlt: primaryAsset?.alt_text ?? null,
    ingredients,
    steps,
    detailedSteps
  };
}

export async function getPublishedRecipes() {
  const { data, error } = await createPublishedRecipesQuery().order("name_en");

  if (error) {
    throw new Error(`Failed to load published recipes: ${error.message}`);
  }

  return data.map(mapRecipe);
}

export async function getPublishedRecipeBySlug(slug: string) {
  const { data, error } = await createPublishedRecipesQuery()
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load recipe ${slug}: ${error.message}`);
  }

  return data ? mapRecipe(data) : null;
}

export async function getPublishedRecipeSlugs() {
  const { data, error } = await createSupabaseServerClient()
    .from("recipes")
    .select("slug")
    .eq("status", "published")
    .order("slug");

  if (error) {
    throw new Error(`Failed to load recipe slugs: ${error.message}`);
  }

  return data.map(({ slug }) => slug);
}
