import Link from "next/link";

export function HomeFinalCta() {
  return (
    <section className="home-final-cta" aria-labelledby="home-final-cta-title">
      <div className="home-final-cta__glow" aria-hidden="true" />
      <div className="home-final-cta__shell page-shell">
        <div className="home-final-cta__copy">
          <h2 id="home-final-cta-title">下一杯，留给你来决定。</h2>
          <p>从一张配方卡，或者一口熟悉的味道开始。</p>
        </div>
        <Link className="home-final-cta__link" href="/taste/demo-negroni">
          开始品鉴
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
