import Image from "next/image";

export function FlavorCompass() {
  return (
    <section
      className="flavor-compass flavor-compass--cocktail"
      aria-label="Paper field"
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
        <Image
          className="flavor-compass__photo-frame"
          src="/images/%E7%AC%AC%E4%BA%8C%E5%B1%8F/%E7%9B%B8%E6%A1%86.jpg"
          alt=""
          width={1487}
          height={1058}
          sizes="(max-width: 760px) 92vw, 64vw"
          unoptimized
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
