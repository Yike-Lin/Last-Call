import Link from "next/link";
import { recipes } from "@/lib/mock-data";

export default function RecipesPage() {
  return (
    <main className="page-shell flex flex-col gap-6 py-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">配方库</h1>
        <p className="text-muted max-w-3xl text-sm leading-6">
          这里先搭好内容结构和页面层级：筛选、风味标签、酒柜匹配，以及通向调制台的清晰路径。
        </p>
      </section>

      <section className="recipes-layout grid gap-4">
        <aside className="panel flex flex-col gap-4 p-5">
          <h2 className="text-lg font-semibold">筛选</h2>
          <div className="flex flex-wrap gap-2">
            <span className="pill">金酒</span>
            <span className="pill">朗姆</span>
            <span className="pill">龙舌兰</span>
            <span className="pill">威士忌</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="pill">柑橘</span>
            <span className="pill">苦感</span>
            <span className="pill">清爽</span>
            <span className="pill">烈感</span>
          </div>
          <div className="panel p-4">
            <p className="text-muted text-sm">
              酒柜匹配逻辑还没正式接线，但界面位置和数据模型已经在这版骨架里预留好了。
            </p>
          </div>
        </aside>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/recipes/${recipe.slug}`}
              className="panel flex flex-col gap-4 p-5 transition hover:border-(--amber)"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">{recipe.name}</h2>
                <span className="pill">{recipe.baseSpirit}</span>
              </div>
              <p className="text-muted text-sm leading-6">{recipe.summary}</p>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-muted mt-auto flex items-center justify-between text-sm">
                <span>{recipe.glassware}</span>
                <span>{recipe.difficulty}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
