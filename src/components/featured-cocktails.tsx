"use client";

import type { CSSProperties, WheelEvent } from "react";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RecipeCard } from "@/lib/mock-data";

type FeaturedCocktailsProps = {
  recipes: RecipeCard[];
};

const cardVisuals = [
  {
    accent: "#d98a32",
    wash: "rgba(217, 138, 50, 0.25)",
    imagePosition: "52% 44%",
    offset: "0px"
  },
  {
    accent: "#8da997",
    wash: "rgba(141, 169, 151, 0.28)",
    imagePosition: "46% 42%",
    offset: "34px"
  },
  {
    accent: "#c47563",
    wash: "rgba(196, 117, 99, 0.27)",
    imagePosition: "58% 48%",
    offset: "-12px"
  }
] as const;

function getEnglishName(name: string) {
  return name.match(/[A-Za-z][A-Za-z-]*(?:\s+[A-Za-z][A-Za-z-]*)*/)?.[0] ?? name;
}

export function FeaturedCocktails({ recipes }: FeaturedCocktailsProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const moveRail = (direction: number) => {
    railRef.current?.scrollBy({
      left: direction * Math.min(420, railRef.current.clientWidth * 0.72),
      behavior: "smooth"
    });
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const rail = railRef.current;

    if (!rail || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    event.preventDefault();
    rail.scrollLeft += event.deltaY;
  };

  return (
    <section className="featured-cocktails" aria-labelledby="featured-cocktails-title">
      <div className="featured-cocktails__shell">
        <div className="featured-cocktails__heading">
          <div>
            <p className="featured-cocktails__eyebrow">03 / FEATURED COCKTAILS</p>
            <h2 id="featured-cocktails-title">TONIGHT&apos;S FIRST POUR.</h2>
            <p className="featured-cocktails__lede">
              先从一杯稳妥的经典开始，再慢慢把你的酒柜喝出自己的节奏。
            </p>
          </div>
          <div className="featured-cocktails__aside">
            <span>CURATED FOR THE HOUR</span>
            <Link href="/recipes">查看全部配方 <span aria-hidden="true">→</span></Link>
          </div>
        </div>

        <div className="featured-cocktails__rail-wrap">
          <button
            className="featured-cocktails__control featured-cocktails__control--previous"
            type="button"
            aria-label="查看上一杯酒"
            onClick={() => moveRail(-1)}
          >
            ←
          </button>

          <div
            id="featured-cocktail-rail"
            ref={railRef}
            className="featured-cocktails__rail"
            onWheel={handleWheel}
            tabIndex={0}
            aria-label="横向浏览推荐酒款"
          >
            {recipes.map((recipe, index) => {
              const visual = cardVisuals[index % cardVisuals.length];
              const tags = recipe.tags.slice(0, 2);

              return (
                <article
                  key={recipe.slug}
                  className="featured-cocktail"
                  style={
                    {
                      "--featured-accent": visual.accent,
                      "--featured-wash": visual.wash,
                      "--featured-image-position": visual.imagePosition,
                      "--featured-offset": visual.offset
                    } as CSSProperties
                  }
                >
                  <Link href={`/recipes/${recipe.slug}`} className="featured-cocktail__link">
                    <span className="featured-cocktail__media" aria-hidden="true">
                      <Image
                        src="/images/home-cocktail.jpg"
                        alt=""
                        fill
                        sizes="(max-width: 767px) 82vw, 32vw"
                        className="featured-cocktail__image"
                        style={{ objectPosition: visual.imagePosition }}
                        priority={index === 0}
                      />
                      <span className="featured-cocktail__wash" />
                      <span className="featured-cocktail__number">0{index + 1}</span>
                      <span className="featured-cocktail__type">HOUSE PICK</span>
                    </span>

                    <span className="featured-cocktail__body">
                      <span className="featured-cocktail__meta">
                        <span>{recipe.baseSpirit}</span>
                        <span aria-hidden="true">/</span>
                        <span>{recipe.glassware}</span>
                      </span>
                      <h3>{getEnglishName(recipe.name)}</h3>
                      <span className="featured-cocktail__tags" aria-label="风味标签">
                        {tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </span>
                      <p>{recipe.summary}</p>
                      <span className="featured-cocktail__cta">
                        查看配方 <span aria-hidden="true">↗</span>
                      </span>
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>

          <button
            className="featured-cocktails__control featured-cocktails__control--next"
            type="button"
            aria-label="查看下一杯酒"
            onClick={() => moveRail(1)}
          >
            →
          </button>
        </div>

        <div className="featured-cocktails__footer" aria-hidden="true">
          <span>DRAG TO EXPLORE</span>
          <span className="featured-cocktails__footer-line" />
          <span>{String(recipes.length).padStart(2, "0")} RECIPES IN THE RAIL</span>
        </div>
      </div>
    </section>
  );
}
