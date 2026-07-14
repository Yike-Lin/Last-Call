"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { navigation } from "@/lib/site";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <header className="site-header-shell">
      <div className="site-header-inner">
        <Link href="/" className="site-header-brand" aria-label="返回首页">
          Last Call
        </Link>

        <div className="site-header-actions">
          <Link href="/cabinet" className="site-header-cabinet">
            酒柜
          </Link>

          <div className={`site-header-menu-control${isMenuOpen ? " site-header-menu-control--open" : ""}`}>
            <nav
              id={menuId}
              role="menu"
              className={`site-header-menu${isMenuOpen ? " site-header-menu--open" : ""}`}
              aria-label="网站菜单"
              aria-hidden={!isMenuOpen}
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="site-header-menu__link"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              className="site-header-menu-toggle"
              aria-controls={menuId}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            >
              {isMenuOpen ? (
                <span className="site-header-menu-close" aria-hidden="true">
                  ×
                </span>
              ) : (
                <>
                  <span className="site-header-menu-label">菜单</span>
                  <span className="site-header-menu-icon" aria-hidden="true">
                    <i />
                    <i />
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
