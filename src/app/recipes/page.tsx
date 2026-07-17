import { RecipeCatalog } from "@/components/recipe-catalog";
import { getPublishedRecipes } from "@/lib/recipes";

type RecipesPageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const [recipes, params] = await Promise.all([getPublishedRecipes(), searchParams]);

  if (recipes.length === 0) {
    return (
      <main className="recipe-catalog-page">
        <section className="recipe-catalog-empty" aria-labelledby="recipe-catalog-title">
          <h1 id="recipe-catalog-title">配方</h1>
          <p>酒单还在整理，稍后再来看看今晚适合哪一杯。</p>
        </section>
      </main>
    );
  }

  const selectedFilter = recipes.some((recipe) => recipe.baseSpirit === params.filter)
    ? params.filter!
    : "全部";

  return <RecipeCatalog recipes={recipes} selectedFilter={selectedFilter} />;
}
