"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { HeroToolScene } from "@/components/hero-tool-scene";

gsap.registerPlugin(useGSAP);

export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useGSAP((_, contextSafe) => {
    const root = rootRef.current;
    const copy = copyRef.current;
    const background = backgroundRef.current;

    if (!root || !copy || !background) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([copy, background], { autoAlpha: 1, clearProps: "transform" });
      return;
    }

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(copy, { autoAlpha: 0, y: 24 });
    gsap.set(background, { autoAlpha: 0, scale: 1.04 });

    intro
      .to(background, { autoAlpha: 1, scale: 1, duration: 1.2 }, 0.1)
      .to(copy, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.45);

    const backgroundXTo = gsap.quickTo(background, "x", {
      duration: 0.8,
      ease: "power3.out"
    });
    const backgroundYTo = gsap.quickTo(background, "y", {
      duration: 0.8,
      ease: "power3.out"
    });

    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }

      const bounds = root.getBoundingClientRect();
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

      backgroundXTo(normalizedX * 10);
      backgroundYTo(normalizedY * 6);
    };

    const resetPointerMotion = () => {
      backgroundXTo(0);
      backgroundYTo(0);
    };

    const handlePointerMove = contextSafe ? contextSafe(movePointer) : movePointer;
    const resetPointer = contextSafe ? contextSafe(resetPointerMotion) : resetPointerMotion;

    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerleave", resetPointer);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", resetPointer);
    };
  }, { scope: rootRef });

  return (
    <section className="home-hero" ref={rootRef} aria-labelledby="home-hero-title">
      <div className="home-hero__background" ref={backgroundRef} aria-hidden="true">
        <span className="home-hero__background-glow home-hero__background-glow--warm" />
        <span className="home-hero__background-glow home-hero__background-glow--cool" />
      </div>

      <div className="home-hero__atmosphere" aria-hidden="true">
        <span className="home-hero__grain" />
      </div>

      <div className="home-hero__inner">
        <div className="home-hero__copy" ref={copyRef}>
          <p className="home-hero__eyebrow">LAST CALL / AFTER DARK</p>
          <h1 id="home-hero-title">
            <span>THE NIGHT</span>
            <strong>STARTS HERE.</strong>
          </h1>
          <p className="home-hero__lede">一杯酒，打开今晚的另一种可能。</p>
          <div className="home-actions">
            <Link className="home-button home-button--primary" href="/recipes">
              找到你的今夜特调
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="home-button home-button--secondary" href="/cabinet">
              查看我的酒柜
            </Link>
          </div>
        </div>

        <div className="home-hero__scene" aria-hidden="true">
          <div className="home-hero__scene-grid" />
          <div className="home-hero__halo" />
          <HeroToolScene />
        </div>
      </div>

    </section>
  );
}
