import Link from "next/link";
import { moodFilterRules } from "@/lib/taste-filters";
import { navigation } from "@/lib/site";

const footerMoods = moodFilterRules.filter(({ label }) => label !== "全部");

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer__shell page-shell">
        <div className="home-footer__top">
          <div className="home-footer__brand">
            <Link href="/" className="home-footer__mark" aria-label="返回首页">
              <svg viewBox="0 0 128 128" aria-hidden="true" focusable="false">
                <use href="/svg/last-call-logo.svg#last-call-logo-mark" />
              </svg>
            </Link>
            <div>
              <p className="home-footer__brand-name">LAST CALL</p>
              <p className="home-footer__brand-copy">把今晚，调成你喜欢的味道。</p>
            </div>
          </div>

          <nav className="home-footer__nav" aria-label="页脚主导航">
            <p className="home-footer__label">探索</p>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="home-footer__link">
                {item.label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>

          <nav className="home-footer__nav home-footer__nav--moods" aria-label="按口味浏览">
            <p className="home-footer__label">口味</p>
            {footerMoods.map(({ label }) => (
              <Link
                key={label}
                href={`/recipes?mood=${encodeURIComponent(label)}`}
                className="home-footer__link"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="home-footer__bottom">
          <span>© 2026 LAST CALL</span>
          <span>一个个人调酒探索站</span>
        </div>
      </div>
    </footer>
  );
}
