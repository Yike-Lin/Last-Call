import Image from "next/image";
import Link from "next/link";
import { recipes } from "@/lib/mock-data";

const flavorShortcuts = [
  "清爽一点",
  "苦得漂亮",
  "酸得醒神",
  "甜但不腻",
  "酒感明显",
  "今天不喝醉"
] as const;

const baseSpirits = ["全部", "金酒", "朗姆", "龙舌兰", "威士忌"] as const;

export default function RecipesPage() {
  const spotlightRecipe = recipes[0];

  return (
    <main className="recipes-page page-shell">
      <section className="recipes-page__intro" aria-labelledby="recipes-title">
        <div className="recipes-page__heading">
          <h1 id="recipes-title">今晚，先选一杯。</h1>
          <p>
            知道名字就搜名字。不知道也没关系，告诉我想喝得酸一点、苦一点，还是轻一点。
          </p>
        </div>

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

        <aside className="recipes-stage" aria-labelledby="spotlight-recipe-title">
          <div className="recipes-stage__heading">
            <p>今晚先喝它</p>
            <h2 id="spotlight-recipe-title">{spotlightRecipe.name}</h2>
            <span>{spotlightRecipe.summary}</span>
          </div>

          <div className="recipes-stage__visual">
            <Image
              src="/images/home-cocktail.jpg"
              alt={`${spotlightRecipe.name} 成品鸡尾酒`}
              fill
              priority
              sizes="(min-width: 1024px) 54vw, 100vw"
            />
          </div>

          <div className="recipes-stage__details">
            <dl className="recipes-stage__facts">
              <div>
                <dt>杯型</dt>
                <dd>{spotlightRecipe.glassware}</dd>
              </div>
              <div>
                <dt>做法</dt>
                <dd>{spotlightRecipe.method}</dd>
              </div>
              <div>
                <dt>酒精度</dt>
                <dd>{spotlightRecipe.estimatedAbv}</dd>
              </div>
            </dl>

            <div className="recipes-stage__ingredients">
              {spotlightRecipe.ingredients.slice(0, 3).map((ingredient) => (
                <span key={ingredient.name}>
                  {ingredient.name} {ingredient.amount}
                </span>
              ))}
            </div>

            <div className="recipes-stage__actions">
              <Link className="cta" href={`/recipes/${spotlightRecipe.slug}`}>
                查看完整配方
              </Link>
              <Link className="cta secondary" href="/mix">
                按我的口味改
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="recipes-mix-bridge">
        <div>
          <h2>没找到完全合适的？</h2>
          <p>从一杯经典开始，再把甜度、酒感和收尾慢慢调成你的版本。</p>
        </div>
        <Link className="cta" href="/mix">
          去赛博调酒
        </Link>
      </section>
    </main>
  );
}
