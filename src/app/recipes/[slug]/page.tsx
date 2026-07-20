import { notFound } from "next/navigation";
import { RecipeDetailExplorer } from "@/components/recipe-detail-explorer";
import {
  getPublishedRecipeBySlug,
  getPublishedRecipeSlugs
} from "@/lib/recipes";

type RecipeDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getPublishedRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { slug } = await params;
  const recipe = await getPublishedRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailExplorer recipe={recipe} />;
}
