import "server-only";

import type { QueryData } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RecipeCard = {
  slug: string;
  name: string;
  baseSpirit: string;
  summary: string;
  tags: string[];
  glassware: string;
  method: string;
  difficulty: string;
  estimatedAbv: string;
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  steps: string[];
};

const recipeSelect = `
  slug,
  name_en,
  name_zh,
  description_en,
  description_zh,
  difficulty,
  primary_method,
  estimated_abv,
  primary_spirit:ingredients!recipes_primary_spirit_id_fkey (
    name_en,
    name_zh
  ),
  glassware:glassware!recipes_glassware_id_fkey (
    name_en,
    name_zh
  ),
  recipe_ingredients (
    amount_value,
    display_amount,
    unit_code,
    sort_order,
    ingredient:ingredients!recipe_ingredients_ingredient_id_fkey (
      name_en,
      name_zh
    )
  ),
  recipe_steps (
    step_number,
    instruction_en,
    instruction_zh
  ),
  recipe_tags (
    tags (
      label_en,
      label_zh
    )
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

function mapRecipe(row: PublishedRecipeRow): RecipeCard {
  const ingredients = [...row.recipe_ingredients]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      name: localizedValue(item.ingredient.name_zh, item.ingredient.name_en),
      amount: formatAmount(
        item.display_amount,
        item.amount_value,
        item.unit_code
      )
    }));

  const steps = [...row.recipe_steps]
    .sort((a, b) => a.step_number - b.step_number)
    .map((step) =>
      localizedValue(step.instruction_zh, step.instruction_en)
    );

  const tags = row.recipe_tags.map(({ tags }) =>
    localizedValue(tags.label_zh, tags.label_en)
  );

  return {
    slug: row.slug,
    name: bilingualName(row.name_zh, row.name_en),
    baseSpirit: row.primary_spirit
      ? localizedValue(row.primary_spirit.name_zh, row.primary_spirit.name_en)
      : "未分类",
    summary: localizedValue(row.description_zh, row.description_en),
    tags,
    glassware: row.glassware
      ? localizedValue(row.glassware.name_zh, row.glassware.name_en)
      : "待确认",
    method: methodLabels[row.primary_method] ?? row.primary_method,
    difficulty: difficultyLabels[row.difficulty] ?? "待评估",
    estimatedAbv:
      row.estimated_abv === null ? "待测算" : `约 ${row.estimated_abv}%`,
    ingredients,
    steps
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
