import { HomeHero } from "@/components/home-hero";
import { FlavorCompass } from "@/components/flavor-compass";
import { FeaturedCocktails } from "@/components/featured-cocktails";
import { HomeFinalCta } from "@/components/home-final-cta";
import { HomeFooter } from "@/components/home-footer";

export default function HomePage() {
  return (
    <>
      <main className="home-page">
        <HomeHero />
        <FlavorCompass />
        <FeaturedCocktails />
        <section className="craft-section craft-section--empty" aria-hidden="true" />
        <HomeFinalCta />
      </main>

      <HomeFooter />
    </>
  );
}
