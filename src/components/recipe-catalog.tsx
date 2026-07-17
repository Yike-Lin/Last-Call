import Link from "next/link";

type RecipeCard = {
  slug: string;
  name: string;
  baseSpirit: string;
  tags: string[];
  method: string;
  estimatedAbv: string;
};

type RecipeCatalogProps = {
  recipes: RecipeCard[];
  selectedFilter: string;
};

export function RecipeCatalog({ recipes, selectedFilter }: RecipeCatalogProps) {
  const filters = ["全部", ...new Set(recipes.map((recipe) => recipe.baseSpirit))];
  const isFiltered = selectedFilter !== "全部";
  const visibleRecipes = isFiltered
    ? recipes.filter((recipe) => recipe.baseSpirit === selectedFilter)
    : recipes;

  return (
    <main className={`recipe-catalog-page${isFiltered ? " recipe-catalog-page--filtered" : ""}`}>
      <section
        className="recipe-catalog-hero"
        aria-label={isFiltered ? "配方" : undefined}
        aria-labelledby={isFiltered ? undefined : "recipe-catalog-title"}
      >
        {!isFiltered ? <h1 id="recipe-catalog-title">配方</h1> : null}

        <div className="recipe-catalog-layout">
          <nav className="recipe-catalog-filters" aria-label="按基酒筛选配方">
            {filters.map((filter) => {
              const isActive = filter === selectedFilter;

              return (
                <Link
                  key={filter}
                  className={isActive ? "is-active" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  href={filter === "全部" ? "/recipes" : `/recipes?filter=${encodeURIComponent(filter)}`}
                >
                  {filter}
                </Link>
              );
            })}
          </nav>

          <section className="recipe-catalog-products" aria-live="polite" aria-label="配方目录">
            {visibleRecipes.map((recipe) => (
              <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="recipe-catalog-card">
                <span className="recipe-catalog-card__image" aria-hidden="true" />
                <h2>{recipe.name}</h2>
                <ul className="recipe-catalog-card__tags" aria-label={`${recipe.name} 标签`}>
                  {[recipe.baseSpirit, recipe.method, recipe.estimatedAbv, ...recipe.tags.slice(0, 2)].map((tag) => (
                    <li key={tag}>{tag.replace("约 ", "")}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
