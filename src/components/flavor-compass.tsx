import Image from "next/image";
import { CocktailLayerStage } from "@/components/cocktail-layer-stage";
import { cocktailSlots } from "@/lib/cocktail-specimens";

export function FlavorCompass() {
  const activeCocktail = cocktailSlots[0];

  return (
    <section
      className="flavor-compass flavor-compass--cocktail"
      aria-label="The Last Seven cocktail corridor"
    >
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

      <div className="flavor-compass__shell">
        <CocktailLayerStage cocktail={activeCocktail} />
      </div>
    </section>
  );
}
