import Link from "next/link";
import { featuredRecipes } from "@/lib/mock-data";

const journeys = [
  {
    href: "/recipes",
    index: "01",
    title: "从一杯经典开始",
    body: "按基酒、风味和调制方式，找到今晚真正想喝的那一杯。",
    action: "探索配方"
  },
  {
    href: "/cabinet",
    index: "02",
    title: "看看酒柜能做什么",
    body: "标记手边已有的酒和辅料，优先发现现在就能完成的配方。",
    action: "打开酒柜"
  },
  {
    href: "/mix",
    index: "03",
    title: "把配方变成一杯酒",
    body: "从杯型、冰块到装饰，跟着步骤完成调制并记录结果。",
    action: "进入调制台"
  }
] as const;

export default function HomePage() {
  const [spotlightRecipe, ...moreRecipes] = featuredRecipes;

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__inner">
          <div className="home-hero__copy">
            <h1>Last Call</h1>
            <p className="home-hero__lede">
              这一杯，算你会喝
            </p>
            <div className="home-actions">
              <Link className="home-button home-button--primary" href="/recipes">
                开始选酒
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="home-button home-button--secondary" href="/cabinet">
                查看我的酒柜
              </Link>
            </div>
          </div>

        </div>
      </section>

      <section className="home-intro page-shell" aria-labelledby="home-intro-title">
        <div className="home-intro__statement">
          <h2 id="home-intro-title">先决定今晚想喝的感觉，再决定杯子里要有什么。</h2>
          <p>
            Last Call 不把你留在一堆标签里。先选你此刻想要的口感，再看手边能调出什么，最后跟着步骤把它做成你自己的版本。
          </p>
        </div>
      </section>

      <section className="home-journeys page-shell" aria-label="开始探索">
        {journeys.map((journey) => (
          <Link
            key={journey.href}
            className="home-journey"
            href={journey.href}
          >
            <span className="home-journey__index">{journey.index}</span>
            <div>
              <h2>{journey.title}</h2>
              <p>{journey.body}</p>
            </div>
            <span className="home-journey__action">
              {journey.action}
              <span aria-hidden="true">↗</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="home-featured" aria-labelledby="featured-title">
        <div className="page-shell">
          <div className="home-featured__heading">
            <div>
              <h2 id="featured-title">今晚推荐的第一杯。</h2>
              <p>
                先从一杯稳妥的经典开始，再慢慢把你的酒柜喝出自己的节奏。
              </p>
            </div>
            <Link href="/recipes">查看全部配方 →</Link>
          </div>

          <div className="home-featured__layout">
            <Link
              className="home-spotlight"
              href={`/recipes/${spotlightRecipe.slug}`}
            >
              <span className="home-spotlight__eyebrow">吧台推荐</span>
              <div className="home-spotlight__content">
                <span className="home-spotlight__base">{spotlightRecipe.baseSpirit}</span>
                <h3>{spotlightRecipe.name}</h3>
                <p>{spotlightRecipe.summary}</p>
                <span className="home-spotlight__link">查看配方 →</span>
              </div>
            </Link>

            <div className="home-recipe-list">
              {moreRecipes.map((recipe) => (
                <Link
                  key={recipe.slug}
                  href={`/recipes/${recipe.slug}`}
                  className="home-recipe-row"
                >
                  <div>
                    <span>{recipe.baseSpirit}</span>
                    <h3>{recipe.name}</h3>
                  </div>
                  <p>{recipe.summary}</p>
                  <span className="home-recipe-row__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-closing page-shell">
        <div>
          <h2>今晚不必从零开始。</h2>
          <p>
            先把已有原料放进酒柜。我们会告诉你现在能做什么，以及只差哪一瓶。
          </p>
        </div>
        <Link className="home-button home-button--light" href="/cabinet">
          整理我的酒柜
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
