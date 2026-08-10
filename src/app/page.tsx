import Image from "next/image";
import { HomeHero } from "@/components/home-hero";
import { FlavorCompass } from "@/components/flavor-compass";
import { FeaturedCocktails } from "@/components/featured-cocktails";
import { HomeFinalCta } from "@/components/home-final-cta";

export default function HomePage() {
  return (
    <>
      <main className="home-page">
        <HomeHero />
        <FlavorCompass />
        <FeaturedCocktails />
        <section className="craft-section craft-section--empty" aria-hidden="true">
          <Image
            className="home-poster__ruler"
            src="/images/hero-left-ruler-reference-clean.png"
            alt=""
            width={124}
            height={1024}
            style={{ width: "auto" }}
          />
          <div className="home-poster__guides" aria-hidden="true">
            <span className="home-poster__guide home-poster__guide--top" />
            <span className="home-poster__guide home-poster__guide--right" />
            <span className="home-poster__guide home-poster__guide--bottom" />
            <span className="home-poster__guide home-poster__guide--left" />
          </div>
        </section>
        <HomeFinalCta />
      </main>
    </>
  );
}
