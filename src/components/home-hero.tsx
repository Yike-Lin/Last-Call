"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const heroLayers = [
  { src: "/svg/hero-glass-shadow.svg", className: "home-hero__layer--shadow" },
  { src: "/svg/hero-glass-liquid.svg", className: "home-hero__layer--liquid" },
  { src: "/svg/hero-ice.svg", className: "home-hero__layer--ice" },
  { src: "/svg/hero-splash.svg", className: "home-hero__layer--splash" },
  { src: "/svg/hero-bubbles.svg", className: "home-hero__layer--bubbles" },
  { src: "/svg/hero-glass-outline.svg", className: "home-hero__layer--outline" },
  { src: "/svg/hero-garnish.svg", className: "home-hero__layer--garnish" }
] as const;

export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLImageElement>(null);

  useGSAP((_, contextSafe) => {
    const root = rootRef.current;
    const copy = copyRef.current;
    const scene = sceneRef.current;
    const object = objectRef.current;
    const spark = sparkRef.current;

    if (!root || !copy || !scene || !object || !spark) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([copy, scene, spark], { autoAlpha: 1, clearProps: "transform" });
      return;
    }

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(copy, { autoAlpha: 0, y: 24 });
    gsap.set(scene, { autoAlpha: 0, y: 28, scale: 0.96 });
    gsap.set(spark, { autoAlpha: 0, scale: 0.2, rotation: -18, transformOrigin: "50% 50%" });

    intro
      .to(scene, { autoAlpha: 1, y: 0, scale: 1, duration: 1.15 }, 0.14)
      .to(copy, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.5)
      .to(spark, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.68, ease: "back.out(1.8)" }, 1.05);

    gsap.to(object, {
      y: -9,
      rotationZ: 0.45,
      duration: 4.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.1
    });

    gsap.to(spark, {
      rotation: 12,
      duration: 5.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.2
    });

    const sceneXTo = gsap.quickTo(scene, "x", {
      duration: 0.8,
      ease: "power3.out"
    });
    const sceneYTo = gsap.quickTo(scene, "y", {
      duration: 0.8,
      ease: "power3.out"
    });
    const objectRotationYTo = gsap.quickTo(object, "rotationY", {
      duration: 0.9,
      ease: "power3.out"
    });
    const objectRotationXTo = gsap.quickTo(object, "rotationX", {
      duration: 0.9,
      ease: "power3.out"
    });

    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }

      const bounds = root.getBoundingClientRect();
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

      sceneXTo(normalizedX * 18);
      sceneYTo(normalizedY * 10);
      objectRotationYTo(normalizedX * 4);
      objectRotationXTo(normalizedY * -2.5);
    };

    const resetPointerMotion = () => {
      sceneXTo(0);
      sceneYTo(0);
      objectRotationYTo(0);
      objectRotationXTo(0);
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
      <div className="home-hero__atmosphere" aria-hidden="true">
        <span className="home-hero__light home-hero__light--left" />
        <span className="home-hero__light home-hero__light--right" />
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
          <div className="home-hero__meta" aria-hidden="true">
            <span>23:47 /</span>
            <span>YOUR EVENING STARTS NOW</span>
          </div>
        </div>

        <div className="home-hero__scene" ref={sceneRef} aria-hidden="true">
          <div className="home-hero__scene-grid" />
          <div className="home-hero__halo" />
          <div className="home-hero__object" ref={objectRef}>
            {heroLayers.map((layer) => (
              <Image
                key={layer.src}
                className={`home-hero__layer ${layer.className}`}
                src={layer.src}
                alt=""
                fill
                sizes="(max-width: 767px) 88vw, 47vw"
                priority={layer.className === "home-hero__layer--outline"}
              />
            ))}
            <Image
              ref={sparkRef}
              className="home-hero__spark"
              src="/svg/hero-spark.svg"
              alt=""
              width={116}
              height={116}
            />
          </div>
          <div className="home-hero__caption">
            <span>01 / HOUSE POUR</span>
            <strong>Old Fashioned</strong>
            <small>BOURBON · ORANGE · BITTERS</small>
          </div>
        </div>
      </div>

      <div className="home-hero__scroll" aria-hidden="true">
        <span>SCROLL TO FIND YOUR POUR</span>
        <i />
      </div>
    </section>
  );
}
