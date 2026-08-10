import Image from "next/image";

export function FeaturedCocktails() {
  return (
    <section className="featured-cocktails featured-cocktails--empty" aria-hidden="true">
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
  );
}
