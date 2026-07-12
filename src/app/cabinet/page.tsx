import { cabinetOverview, featuredRecipes } from "@/lib/mock-data";

export default function CabinetPage() {
  return (
    <main className="page-shell flex flex-col gap-8 py-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">我的酒柜</h1>
        <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
          MVP 先从简单的拥有状态开始：已拥有、常备、缺货。这样已经足够驱动配方匹配，不必一开始就陷入瓶级库存的复杂度。
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="panel flex flex-col gap-4 p-6">
          <h2 className="text-xl font-semibold">概览</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {cabinetOverview.map((item) => (
              <div key={item.label} className="panel p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel flex flex-col gap-5 p-6">
          <h2 className="text-xl font-semibold">当前酒柜示例</h2>
          <div className="flex flex-wrap gap-2">
            {["金酒", "朗姆", "伏特加", "青柠汁", "糖浆", "苏打水", "安哥仕苦精"].map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
          <div className="panel p-4">
            <p className="text-sm font-medium">下一步最值得补的酒</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
              <li>甜味美思</li>
              <li>金巴利</li>
              <li>白龙舌兰</li>
            </ul>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredRecipes.slice(0, 2).map((recipe) => (
              <div key={recipe.slug} className="panel p-4">
                <p className="text-sm font-semibold">{recipe.name}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{recipe.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
