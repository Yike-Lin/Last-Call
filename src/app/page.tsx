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
