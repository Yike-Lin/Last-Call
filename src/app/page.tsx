import Image from "next/image";
import Link from "next/link";
import { featuredRecipes } from "@/lib/mock-data";

const journeys = [
  {
    href: "/recipes",
    index: "01",
    title: "从一杯经典开始",
    body: "按基酒、风味和调制方式，找到今晚真正想喝的那一杯。",
    action: "探索配方",
    tone: "amber"
  },
  {
    href: "/cabinet",
    index: "02",
    title: "看看酒柜能做什么",
    body: "标记手边已有的酒和辅料，优先发现现在就能完成的配方。",
    action: "打开酒柜",
    tone: "teal"
  },
  {
    href: "/mix",
    index: "03",
    title: "把配方变成一杯酒",
    body: "从杯型、冰块到装饰，跟着步骤完成调制并记录结果。",
    action: "进入调制台",
    tone: "coral"
  }
] as const;

export default function HomePage() {
  const [spotlightRecipe, ...moreRecipes] = featuredRecipes;

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__inner">
          <div className="home-hero__copy">
            <p className="home-kicker">今晚，从你的酒柜出发</p>
            <h1>
              找到今晚
              <span>刚好的酒。</span>
            </h1>
            <p className="home-hero__lede">
              浏览经典鸡尾酒，匹配手边原料，再一步步调出属于你的版本。Last Call 把发现、准备和记录放在同一个地方。
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

          <div className="home-hero__visual">
            <Image
              src="/images/home-cocktail.jpg"
              alt="黑色背景前，一杯带橙皮装饰的琥珀色鸡尾酒"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 50vw"
            />
            <div className="home-hero__caption">
              <span>Tonight&apos;s pour</span>
              <strong>Old Fashioned</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="home-intro page-shell" aria-labelledby="home-intro-title">
        <p className="home-section-note">一条更短的选酒路径</p>
        <div className="home-intro__statement">
          <h2 id="home-intro-title">不用先懂酒，也能从今晚的心情开始。</h2>
          <p>
            Last Call 不把你留在一堆标签里。先选想喝的风味，再看酒柜里有什么，最后跟着步骤完成一杯。
          </p>
        </div>
      </section>

      <section className="home-journeys page-shell" aria-label="开始探索">
        {journeys.map((journey) => (
          <Link
            key={journey.href}
            className={`home-journey home-journey--${journey.tone}`}
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
              <p className="home-section-note">今晚推荐</p>
              <h2 id="featured-title">先认识一杯经典。</h2>
            </div>
            <Link href="/recipes">查看全部配方 →</Link>
          </div>

          <div className="home-featured__layout">
            <Link
              className="home-spotlight"
              href={`/recipes/${spotlightRecipe.slug}`}
            >
              <div className="home-spotlight__orb" aria-hidden="true">
                <span />
              </div>
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
          <p className="home-section-note">下一杯，由你决定</p>
          <h2>今晚不必从零开始。</h2>
        </div>
        <p>
          先把已有原料放进酒柜。我们会告诉你现在能做什么，以及只差哪一瓶。
        </p>
        <Link className="home-button home-button--light" href="/cabinet">
          整理我的酒柜
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
