import Link from "next/link";
import { getPublishedRecipes } from "@/lib/recipes";

const flavorShortcuts = [
  "清爽一点",
  "苦得漂亮",
  "酸得醒神",
  "甜但不腻",
  "酒感明显",
  "今天不喝醉"
] as const;

const baseSpirits = ["全部", "金酒", "朗姆", "龙舌兰", "威士忌"] as const;

export default async function RecipesPage() {
  const recipes = await getPublishedRecipes();
  const spotlightRecipe = recipes[0];

  if (!spotlightRecipe) {
    return (
      <main className="recipes-page page-shell">
        <section className="recipes-page__intro">
          <div className="recipes-page__heading">
            <h1>配方正在上架</h1>
            <p>酒单还在整理，稍后再来看看今晚适合哪一杯。</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="recipes-page page-shell">
      <section className="recipes-page__intro">
        <div className="recipes-search">
          <input
            aria-label="搜索配方"
            name="recipe-search"
            placeholder="搜“内格罗尼”，或者输入“清爽、不太甜”"
            type="search"
          />
          <button type="button">找一杯</button>
          <Link href={`/recipes/${recipes[1]?.slug ?? spotlightRecipe.slug}`}>
            随便来一杯
          </Link>
        </div>

        <div className="recipes-flavor-shortcuts" aria-label="按风味快速筛选">
          {flavorShortcuts.map((flavor, index) => (
            <button
              key={flavor}
              className={index === 0 ? "is-selected" : undefined}
              type="button"
              aria-pressed={index === 0}
            >
              {flavor}
            </button>
          ))}
        </div>
      </section>

      <section className="recipes-filter-bar" aria-label="配方筛选">
        <div className="recipes-filter-group">
          <span>基酒</span>
          {baseSpirits.map((spirit, index) => (
            <button
              key={spirit}
              className={index === 0 ? "is-selected" : undefined}
              type="button"
              aria-pressed={index === 0}
            >
              {spirit}
            </button>
          ))}
        </div>

        <button className="recipes-cabinet-filter" type="button" aria-pressed="false">
          只看酒柜里能做的
        </button>

        <label className="recipes-sort">
          <span>排序</span>
          <select defaultValue="tonight" aria-label="配方排序方式">
            <option value="tonight">最适合今晚</option>
            <option value="quick">制作最快</option>
            <option value="low-abv">酒精度从低到高</option>
          </select>
        </label>
      </section>

      <section className="recipes-theater" aria-labelledby="recipe-index-title">
        <div className="recipes-index">
          <header className="recipes-index__header">
            <div>
              <p>配方索引</p>
              <h2 id="recipe-index-title">先从经典开始</h2>
            </div>
            <span>{String(recipes.length).padStart(2, "0")} 杯</span>
          </header>

          <div className="recipes-index__list">
            {recipes.map((recipe, index) => (
              <Link
                key={recipe.slug}
                href={`/recipes/${recipe.slug}`}
                className={`recipe-index-row${index === 0 ? " is-current" : ""}`}
              >
                <span className="recipe-index-row__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="recipe-index-row__content">
                  <div className="recipe-index-row__title">
                    <h3>{recipe.name}</h3>
                    <span>{recipe.baseSpirit}</span>
                  </div>
                  <p>{recipe.summary}</p>
                  <div className="recipe-index-row__meta">
                    <span>{recipe.method}</span>
                    <span>{recipe.estimatedAbv}</span>
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>
                <span className="recipe-index-row__action">查看</span>
              </Link>
            ))}
          </div>
        </div>

      </section>

    </main>
  );
}
