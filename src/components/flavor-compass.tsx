import Image from "next/image";

const ingredientCards = [
  {
    key: "gin",
    label: "GIN",
    amount: "50 ML",
    src: "/images/%E7%AC%AC%E4%BA%8C%E5%B1%8F/01-ingredient-gin-framed.png",
  },
  {
    key: "tonic",
    label: "TONIC",
    amount: "120 ML",
    src: "/images/%E7%AC%AC%E4%BA%8C%E5%B1%8F/01-ingredient-tonic-framed.png",
  },
  {
    key: "lime",
    label: "LIME",
    amount: "1 WEDGE",
    src: "/images/%E7%AC%AC%E4%BA%8C%E5%B1%8F/01-ingredient-lime-framed.png",
  },
  {
    key: "ice",
    label: "ICE",
    amount: "FULL",
    src: "/images/%E7%AC%AC%E4%BA%8C%E5%B1%8F/01-ingredient-ice-framed.png",
  },
];

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
        <div className="flavor-compass__copy">
          <div className="flavor-compass__title-lockup">
            <h2>
              <span>GIN &amp;</span>
              <span>TONIC</span>
            </h2>
            <span className="flavor-compass__index" aria-hidden="true">
              01
            </span>
          </div>
          <span className="flavor-compass__rule" aria-hidden="true" />
          <p>CRISP · COLD · EFFERVESCENT</p>
        </div>

        <div
          className="flavor-compass__ingredient-stack"
          aria-label="Gin and tonic ingredients"
        >
          {ingredientCards.map((card) => (
            <div
              className={`flavor-compass__ingredient-item flavor-compass__ingredient-item--${card.key}`}
              key={card.key}
            >
              <div
                className={`flavor-compass__ingredient-card flavor-compass__ingredient-card--${card.key}`}
              >
                <Image
                  src={card.src}
                  alt={`${card.label} ingredient`}
                  fill
                  sizes="140px"
                  unoptimized
                />
              </div>
              <p className="flavor-compass__ingredient-note">
                <span>{card.label}</span>
                <span aria-hidden="true">—</span>
                <span>{card.amount}</span>
              </p>
              <span className="flavor-compass__ingredient-arrow" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="flavor-compass__photo-stage" aria-hidden="true">
          <div className="flavor-compass__photo-window">
            <Image
              className="flavor-compass__photo"
              src="/images/%E7%AC%AC%E4%BA%8C%E5%B1%8F/01-gin-tonic-photo.png"
              alt=""
              fill
              sizes="(max-width: 760px) 74vw, 52vw"
              unoptimized
            />
          </div>
          <Image
            className="flavor-compass__photo-frame"
            src="/images/%E7%AC%AC%E4%BA%8C%E5%B1%8F/%E7%9B%B8%E6%A1%86.jpg"
            alt=""
            fill
            sizes="(max-width: 760px) 92vw, 64vw"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
