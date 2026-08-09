import Image from "next/image";

export function HomeHero() {
  return (
    <section className="home-hero home-hero--clean" aria-labelledby="home-poster-title">
      <Image
        className="home-poster__ruler"
        src="/images/hero-left-ruler-reference-clean.png"
        alt=""
        width={124}
        height={1024}
        style={{ width: "auto" }}
        priority
      />

      <div className="home-poster">
        <div className="home-poster__guides" aria-hidden="true">
          <span className="home-poster__guide home-poster__guide--top" />
          <span className="home-poster__guide home-poster__guide--right" />
          <span className="home-poster__guide home-poster__guide--bottom" />
          <span className="home-poster__guide home-poster__guide--left" />
        </div>

        <div className="home-poster__masthead">
          <h1 id="home-poster-title">LAST CALL</h1>
        </div>

        <div className="home-poster__body">
          <div className="home-poster__copy">
            <h2>
              I STAY FOR
              <br />
              THE LAST POUR.
            </h2>

            <p className="home-poster__prompt">HOLD TO POUR</p>
          </div>

          <div className="home-poster__glass-stage" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
