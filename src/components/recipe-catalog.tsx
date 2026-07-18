"use client";

import type { CSSProperties } from "react";
import { useDeferredValue, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type RecipeCard = {
  slug: string;
  name: string;
  baseSpirit: string;
  tags: string[];
  method: string;
  estimatedAbv: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

type RecipeCatalogProps = {
  recipes: RecipeCard[];
  selectedMood: string;
  selectedSpirit: string;
};

const moodFilters = ["全部", "清爽", "苦甜", "果香", "烈", "低度"] as const;
const pageSize = 24;

type MoodFilter = (typeof moodFilters)[number];

const moodKeywords: Partial<Record<MoodFilter, string[]>> = {
  清爽: ["清爽", "明快", "薄荷", "长饮", "气泡"],
  苦甜: ["苦感", "苦甜", "草本", "甜", "可可"],
  果香: ["柑橘", "橙香", "果香", "莓", "苹果", "菠萝", "葡萄柚"]
};

const spiritStages: Array<{
  keywords: string[];
  stage: string;
  accent: string;
}> = [
  { keywords: ["龙舌兰"], stage: "#e8ddd3", accent: "#c95c40" },
  { keywords: ["朗姆"], stage: "#dce5e2", accent: "#55716f" },
  { keywords: ["金酒"], stage: "#dde2d5", accent: "#707a58" },
  { keywords: ["威士忌"], stage: "#e4d6cc", accent: "#a84f38" }
];

function normalizeMood(value: string): MoodFilter {
  return moodFilters.includes(value as MoodFilter) ? (value as MoodFilter) : "全部";
}

function parseAbv(value: string) {
  const match = value.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function matchesMood(recipe: RecipeCard, mood: MoodFilter) {
  if (mood === "全部") {
    return true;
  }

  const abv = parseAbv(recipe.estimatedAbv);

  if (mood === "烈") {
    return abv !== null && abv >= 20;
  }

  if (mood === "低度") {
    return abv !== null && abv <= 15;
  }

  const keywords = moodKeywords[mood] ?? [];
  return recipe.tags.some((tag) => keywords.some((keyword) => tag.includes(keyword)));
}

function matchesSearch(recipe: RecipeCard, query: string) {
  if (!query) {
    return true;
  }

  const searchableText = [
    recipe.name,
    recipe.baseSpirit,
    recipe.method,
    recipe.estimatedAbv,
    ...recipe.tags
  ]
    .join(" ")
    .toLocaleLowerCase();

  return searchableText.includes(query);
}

function getSpiritStage(baseSpirit: string) {
  return (
    spiritStages.find(({ keywords }) =>
      keywords.some((keyword) => baseSpirit.includes(keyword))
    ) ?? { stage: "#e6e1d7", accent: "#707a58" }
  );
}

function updateRecipeUrl(mood: MoodFilter, spirit: string) {
  const params = new URLSearchParams();

  if (mood !== "全部") {
    params.set("mood", mood);
  }

  if (spirit !== "全部") {
    params.set("spirit", spirit);
  }

  const query = params.toString();
  window.history.replaceState(window.history.state, "", query ? `/recipes?${query}` : "/recipes");
}

export function RecipeCatalog({
  recipes,
  selectedMood,
  selectedSpirit
}: RecipeCatalogProps) {
  const prefersReducedMotion = useReducedMotion();
  const baseSpirits = useMemo(
    () => ["全部", ...new Set(recipes.map((recipe) => recipe.baseSpirit))],
    [recipes]
  );
  const normalizedMood = normalizeMood(selectedMood);
  const normalizedSpirit = baseSpirits.includes(selectedSpirit) ? selectedSpirit : "全部";
  const [activeMood, setActiveMood] = useState<MoodFilter>(normalizedMood);
  const [activeSpirit, setActiveSpirit] = useState(normalizedSpirit);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(pageSize);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLocaleLowerCase());

  const filteredRecipes = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          matchesMood(recipe, activeMood) &&
          (activeSpirit === "全部" || recipe.baseSpirit === activeSpirit) &&
          matchesSearch(recipe, deferredSearchQuery)
      ),
    [activeMood, activeSpirit, deferredSearchQuery, recipes]
  );
  const visibleRecipes = filteredRecipes.slice(0, visibleLimit);

  const updateFilters = (mood: MoodFilter, spirit: string) => {
    setActiveMood(mood);
    setActiveSpirit(spirit);
    setVisibleLimit(pageSize);
    updateRecipeUrl(mood, spirit);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setVisibleLimit(pageSize);
  };

  const motionTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };
  const resultLabel =
    visibleRecipes.length < filteredRecipes.length
      ? `${visibleRecipes.length} / ${filteredRecipes.length}`
      : `${filteredRecipes.length}`;

  return (
    <main className="recipe-catalog-page">
      <div className="recipe-catalog-shell">
        <section className="recipe-catalog-intro" aria-labelledby="recipe-catalog-title">
          <h1 id="recipe-catalog-title">配方</h1>
          <p>今晚，想喝哪一杯？</p>
        </section>

        <section className="recipe-catalog-filter-rail" aria-label="筛选配方">
          <div className="recipe-catalog-filter-row">
            <span className="recipe-catalog-filter-label">口味</span>
            <div className="recipe-catalog-filter-main">
              <div className="recipe-catalog-filter-options" role="group" aria-label="按口味筛选">
                {moodFilters.map((mood) => (
                  <button
                    key={mood}
                    className={mood === activeMood ? "is-active" : undefined}
                    type="button"
                    aria-pressed={mood === activeMood}
                    onClick={() => updateFilters(mood, activeSpirit)}
                  >
                    {mood}
                  </button>
                ))}
              </div>

              <label className="recipe-catalog-search">
                <span className="recipe-catalog-visually-hidden">搜索配方</span>
                <input
                  type="search"
                  value={searchQuery}
                  placeholder="搜索配方"
                  aria-label="搜索配方"
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setVisibleLimit(pageSize);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="recipe-catalog-filter-row recipe-catalog-filter-row--secondary">
            <span className="recipe-catalog-filter-label">基酒</span>
            <div className="recipe-catalog-filter-main">
              <div className="recipe-catalog-filter-options" role="group" aria-label="按基酒筛选">
                {baseSpirits.map((spirit) => (
                  <button
                    key={spirit}
                    className={spirit === activeSpirit ? "is-active" : undefined}
                    type="button"
                    aria-pressed={spirit === activeSpirit}
                    onClick={() => updateFilters(activeMood, spirit)}
                  >
                    {spirit}
                  </button>
                ))}
              </div>
              <span className="recipe-catalog-results" aria-live="polite">
                {resultLabel} 杯
              </span>
            </div>
          </div>
        </section>

        <section className="recipe-catalog-products" aria-live="polite" aria-label="配方目录">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleRecipes.map((recipe) => {
              const stage = getSpiritStage(recipe.baseSpirit);
              const flavor = recipe.tags[0] ?? "经典";
              const imageSource = recipe.imageUrl;

              return (
                <motion.article
                  layout
                  key={recipe.slug}
                  className="recipe-catalog-card"
                  style={
                    {
                      "--recipe-stage": stage.stage,
                      "--recipe-accent": stage.accent
                    } as CSSProperties
                  }
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={motionTransition}
                >
                  <Link href={`/recipes/${recipe.slug}`} className="recipe-catalog-card__link">
                    <span
                      className="recipe-catalog-card__media"
                      aria-hidden={imageSource ? undefined : true}
                    >
                      {imageSource ? (
                        <Image
                          src={imageSource}
                          alt={recipe.imageAlt ?? recipe.name}
                          fill
                          sizes="(max-width: 640px) 92vw, (max-width: 980px) 30vw, 22vw"
                          className="recipe-catalog-card__image"
                        />
                      ) : (
                        <span className="recipe-catalog-card__stage" />
                      )}
                    </span>

                    <span className="recipe-catalog-card__heading">
                      <h2>{recipe.name}</h2>
                      <span className="recipe-catalog-card__flavor">{flavor}</span>
                    </span>

                    <span
                      className="recipe-catalog-card__spec"
                      aria-label={`${recipe.baseSpirit}，${recipe.method}，${recipe.estimatedAbv}`}
                    >
                      <span>{recipe.baseSpirit}</span>
                      <span aria-hidden="true">·</span>
                      <span>{recipe.method}</span>
                      <span aria-hidden="true">·</span>
                      <span>{recipe.estimatedAbv.replace("约 ", "")}</span>
                    </span>
                  </Link>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {filteredRecipes.length === 0 ? (
            <div className="recipe-catalog-no-results">
              <p>今晚没有符合这组口味的酒。</p>
              <button
                type="button"
                onClick={() => {
                  updateFilters("全部", "全部");
                  resetSearch();
                }}
              >
                清空筛选
              </button>
            </div>
          ) : null}

          {visibleRecipes.length < filteredRecipes.length ? (
            <div className="recipe-catalog-load-more">
              <button type="button" onClick={() => setVisibleLimit((limit) => limit + pageSize)}>
                再看 {Math.min(pageSize, filteredRecipes.length - visibleRecipes.length)} 杯
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
