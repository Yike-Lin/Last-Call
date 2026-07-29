"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navigation } from "@/lib/site";

export function SiteHeader() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (CSS.supports("animation-timeline: scroll()")) {
      return;
    }

    const updateVisibility = () => {
      const heroTitle = document.querySelector<HTMLElement>(".home-hero h1");

      if (!heroTitle) {
        setIsHidden(false);
        return;
      }

      const titleBounds = heroTitle.getBoundingClientRect();
      const titleMiddle = titleBounds.top + window.scrollY + titleBounds.height / 2;
      setIsHidden(window.scrollY >= titleMiddle - 84);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <header className={`site-header-shell${isHidden ? " site-header-shell--hidden" : ""}`}>
      <div className="site-header-inner">
        <Link href="/" className="site-header-brand" aria-label="返回首页">
          <svg className="site-header-logo" viewBox="0 0 128 128" aria-hidden="true" focusable="false">
            <use href="/svg/last-call-logo.svg#last-call-logo-mark" />
          </svg>
        </Link>

        <nav className="site-header-nav" aria-label="主导航">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="site-header-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="mailto:hello@lastcall.com" className="site-header-contact">
          联系我们
        </Link>
      </div>
    </header>
  );
}
