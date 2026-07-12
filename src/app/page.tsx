import Link from "next/link";
import { SectionCard } from "@/components/section-card";
import { featuredRecipes, quickStats } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <main className="page-shell flex flex-col gap-10 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="panel flex flex-col gap-5 p-6">
          <div className="flex flex-wrap gap-2">
            <span className="pill">交互式调酒</span>
            <span className="pill">个人酒柜</span>
            <span className="pill">品鉴结果</span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-normal">Last Call</h1>
            <p className="max-w-2xl text-[15px] leading-7 text-[var(--muted)]">
              浏览经典鸡尾酒配方，把它们与你自己的酒柜联动，在网页里亲手调一杯，并保存属于你的品鉴卡片。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="cta" href="/recipes">
              浏览配方
            </Link>
            <Link className="cta secondary" href="/cabinet">
              打开酒柜
            </Link>
          </div>
        </div>

        <div className="panel grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-1">
          {quickStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
              <div>
                <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{stat.note}</p>
              </div>
              <strong className="text-2xl font-semibold">{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SectionCard
          title="配方库"
          body="按基酒、风味平衡，或你现在就能做的酒来查找。"
          href="/recipes"
          accent="var(--amber)"
        />
        <SectionCard
          title="我的酒柜"
          body="管理你真正拥有的酒和辅料，并找出最接近可完成的配方。"
          href="/cabinet"
          accent="var(--teal)"
        />
        <SectionCard
          title="调制台"
          body="从杯型、冰块、基酒到装饰，按步骤完成并获得即时反馈。"
          href="/mix"
          accent="var(--coral)"
        />
        <SectionCard
          title="品鉴卡"
          body="保存带有酒体、平衡和适饮场景建议的结构化结果。"
          href="/taste/demo-negroni"
          accent="var(--amber)"
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">推荐配方</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              第一批种子数据会优先覆盖辨识度高的经典酒款，既方便浏览，也方便做酒柜联动。
            </p>
          </div>
          <Link className="text-sm text-[var(--amber)]" href="/recipes">
            查看全部
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredRecipes.map((recipe) => (
            <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="panel flex flex-col gap-4 p-5 transition hover:border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{recipe.name}</h3>
                <span className="pill">{recipe.baseSpirit}</span>
              </div>
              <p className="text-sm leading-6 text-[var(--muted)]">{recipe.summary}</p>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
