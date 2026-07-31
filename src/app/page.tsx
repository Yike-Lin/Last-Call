import Image from "next/image";
import Link from "next/link";
import { featuredRecipes } from "@/lib/mock-data";
import { HomeHero } from "@/components/home-hero";
import { FlavorCompass } from "@/components/flavor-compass";
import { FeaturedCocktails } from "@/components/featured-cocktails";

export default function HomePage() {
  return (
    <main className="home-page">
      <HomeHero />
      <FlavorCompass />

      <FeaturedCocktails recipes={featuredRecipes} />

      <section className="craft-section" aria-labelledby="craft-title">
        <div className="craft-section__shell">
          <div className="craft-section__media">
            <Image
              src="/images/home-cocktail.jpg"
              alt="一杯正在吧台上完成的琥珀色鸡尾酒"
              fill
              sizes="(max-width: 767px) 100vw, 48vw"
              className="craft-section__image"
            />
            <div className="craft-section__media-frame" aria-hidden="true" />
            <div className="craft-section__media-caption" aria-hidden="true">
              <span>THE HAND BEHIND THE GLASS</span>
              <strong>04 / 04</strong>
            </div>
          </div>

          <div className="craft-section__copy">
            <p className="craft-section__eyebrow">04 / THE CRAFT</p>
            <h2 id="craft-title">
              MADE SLOWLY.
              <br />
              SERVED TONIGHT.
            </h2>
            <p className="craft-section__statement">
              我们不追求复杂，
              <br />
              只追求每一杯都刚好。
            </p>
            <div className="craft-section__rule" aria-hidden="true" />
            <div className="craft-section__notes">
              <span>TIME</span>
              <strong>ICE / AROMA / BALANCE</strong>
            </div>
            <Link className="craft-section__link" href="/mix">
              进入调制台
              <span aria-hidden="true">↗</span>
            </Link>
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
