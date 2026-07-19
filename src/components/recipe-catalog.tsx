"use client";

import type { CSSProperties } from "react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { RecipeCard, RecipeTag } from "@/lib/recipes";

type RecipeCatalogProps = {
  recipes: RecipeCard[];
  selectedMood: string;
  selectedSpirit: string;
};

const moodFilterRules = [
  { label: "全部", slugs: [], labels: [] },
  { label: "清爽", slugs: ["refreshing", "mint", "sparkling"], labels: ["清爽", "薄荷", "气泡"] },
  { label: "酸爽", slugs: ["sour", "acidic", "citrus"], labels: ["酸爽", "柑橘"] },
  { label: "苦甜", slugs: ["bitter", "bittersweet"], labels: ["苦甜", "苦感"] },
  { label: "草本", slugs: ["herbal", "mint"], labels: ["草本", "薄荷"] },
  { label: "果香", slugs: ["fruit", "berry", "apple", "pineapple", "peach", "grapefruit"], labels: ["果香", "莓", "苹果", "菠萝", "桃", "葡萄柚"] },
  { label: "香料", slugs: ["spice", "spiced", "aromatic", "vanilla", "oak"], labels: ["香料", "辛香", "香草", "橡木"] },
  { label: "酒感", slugs: ["spirit-forward"], labels: ["酒感", "酒体前置"] }
] as const;

const baseSpiritFilters = ["全部", "金酒", "朗姆", "龙舌兰", "伏特加", "威士忌", "白兰地"] as const;
const pageSize = 24;

type MoodFilter = (typeof moodFilterRules)[number]["label"];
type SpiritFilter = (typeof baseSpiritFilters)[number];
type MoodFilterRule = (typeof moodFilterRules)[number];

const spiritStages: Array<{
  category: string;
  stage: string;
  accent: string;
}> = [
  { category: "金酒", stage: "#dde2d5", accent: "#707a58" },
  { category: "朗姆", stage: "#dce5e2", accent: "#55716f" },
  { category: "龙舌兰", stage: "#e8ddd3", accent: "#c95c40" },
  { category: "伏特加", stage: "#e7e8e3", accent: "#89918e" },
  { category: "威士忌", stage: "#e4d6cc", accent: "#a84f38" },
  { category: "白兰地", stage: "#ead8ca", accent: "#9f6446" }
];

const spiritAliases: Record<Exclude<SpiritFilter, "全部">, string[]> = {
  金酒: ["金酒", "杜松子酒", "gin"],
  朗姆: ["朗姆", "rum"],
  龙舌兰: ["龙舌兰", "tequila", "mezcal", "梅斯卡尔"],
  伏特加: ["伏特加", "vodka"],
  威士忌: ["威士忌", "波本", "bourbon", "rye", "whiskey", "whisky"],
  白兰地: ["白兰地", "干邑", "brandy", "cognac", "armagnac"]
};

const tagDisplayLabels: Record<string, string> = {
  bitter: "苦甜",
  bittersweet: "苦甜",
  sour: "酸爽",
  acidic: "酸爽",
  refreshing: "清爽",
  herbal: "草本",
  citrus: "柑橘",
  mint: "薄荷",
  sparkling: "气泡",
  orange: "橙香",
  spice: "香料",
  spiced: "香料",
  "spirit-forward": "酒感",
  "slow-sipping": "慢饮"
};

const tasteTagTones: Record<string, { paper: string; border: string; ink: string }> = {
  酸爽: { paper: "#dce5e2", border: "#9fb4ad", ink: "#2f504c" },
  柑橘: { paper: "#efd0b4", border: "#d69066", ink: "#733423" },
  清爽: { paper: "#dde2d5", border: "#9da883", ink: "#3f4a31" },
  苦甜: { paper: "#e8c0b2", border: "#c95c40", ink: "#642b1f" },
  草本: { paper: "#dfe5d4", border: "#707a58", ink: "#39422d" },
  薄荷: { paper: "#d9e7dc", border: "#81a783", ink: "#31523a" },
  气泡: { paper: "#e2ebe8", border: "#9ab6b1", ink: "#385753" },
  橙香: { paper: "#edc7a8", border: "#c95c40", ink: "#743822" },
  果香: { paper: "#ead2c9", border: "#c98270", ink: "#6b3930" },
  香料: { paper: "#e6d0c0", border: "#a56d50", ink: "#5a3428" },
  酒感: { paper: "#e2d4c9", border: "#a76a4d", ink: "#57372a" },
  慢饮: { paper: "#e7ddd2", border: "#9a7d65", ink: "#514235" }
};

const tasteTagTilts = ["-0.7deg", "0.45deg", "-0.35deg"];
const hiddenCardTagSlugs = new Set(["short-drink", "long-drink"]);

function normalizeMood(value: string, availableFilters: MoodFilter[]): MoodFilter {
  return availableFilters.includes(value as MoodFilter) ? (value as MoodFilter) : "全部";
}

function normalizeSpirit(value: string): SpiritFilter {
  if (baseSpiritFilters.includes(value as SpiritFilter)) {
    return value as SpiritFilter;
  }

  const normalizedValue = value.toLocaleLowerCase();
  const matchedSpirit = Object.entries(spiritAliases).find(([, aliases]) =>
    aliases.some((alias) => normalizedValue.includes(alias.toLocaleLowerCase()))
  );

  return (matchedSpirit?.[0] as SpiritFilter | undefined) ?? "全部";
}

function getTagLabel(tag: RecipeTag) {
  return tagDisplayLabels[tag.slug] ?? tag.label;
}

function getRecipeText(recipe: RecipeCard) {
  return [
    recipe.name,
    recipe.summary,
    recipe.baseSpirit,
    recipe.baseSpiritCategory,
    ...recipe.ingredients.map((ingredient) => ingredient.name),
    ...recipe.steps
  ]
    .join(" ")
    .toLocaleLowerCase();
}

function recipeHasTag(recipe: RecipeCard, rule: MoodFilterRule) {
  const slugs = rule.slugs as readonly string[];
  const labels = rule.labels as readonly string[];

  return recipe.tags.some((tag) => {
    const label = getTagLabel(tag);

    return (
      slugs.includes(tag.slug) ||
      labels.some((keyword) => label.includes(keyword))
    );
  });
}

function matchesMood(recipe: RecipeCard, mood: MoodFilter) {
  if (mood === "全部") {
    return true;
  }

  if (mood === "清爽") {
    return recipeHasTag(recipe, moodFilterRules[1]) || (recipe.balance.sour >= 3 && recipe.balance.spirit <= 2);
  }

  if (mood === "酸爽") {
    return recipeHasTag(recipe, moodFilterRules[2]) || recipe.balance.sour >= 4;
  }

  if (mood === "苦甜") {
    return recipeHasTag(recipe, moodFilterRules[3]) || recipe.balance.bitter >= 3;
  }

  if (mood === "草本") {
    return recipeHasTag(recipe, moodFilterRules[4]);
  }

  if (mood === "果香") {
    return recipeHasTag(recipe, moodFilterRules[5]);
  }

  if (mood === "香料") {
    return recipeHasTag(recipe, moodFilterRules[6]);
  }

  if (mood === "酒感") {
    return recipeHasTag(recipe, moodFilterRules[7]) || recipe.balance.spirit >= 4;
  }

  return false;
}

function matchesSearch(recipe: RecipeCard, query: string) {
  if (!query) {
    return true;
  }

  const searchableText = [
    recipe.name,
    recipe.summary,
    recipe.baseSpirit,
    recipe.baseSpiritCategory,
    recipe.method,
    recipe.estimatedAbv,
    ...recipe.baseSpirits.flatMap((spirit) => [spirit.label, spirit.category]),
    ...recipe.ingredients.map((ingredient) => ingredient.name),
    ...recipe.tags.map(getTagLabel)
  ]
    .join(" ")
    .toLocaleLowerCase();

  return searchableText.includes(query);
}

function getSpiritStage(baseSpiritCategory: string) {
  return (
    spiritStages.find(({ category }) => category === baseSpiritCategory) ??
    { stage: "#e6e1d7", accent: "#707a58" }
  );
}

function getBaseSpiritSummary(recipe: RecipeCard) {
  const spirits = recipe.baseSpirits.filter((spirit) => spirit.category !== "其他");

  if (spirits.length === 0) {
    return recipe.baseSpiritCategory === "其他" ? "未分类" : recipe.baseSpiritCategory;
  }

  const primary = spirits[0];

  if (spirits.length === 1) {
    return primary.category;
  }

  if (spirits.length === 2) {
    if (primary.ratio !== null && primary.ratio >= 0.65) {
      return `${primary.category} +1`;
    }

    return `${spirits[0].category} / ${spirits[1].category}`;
  }

  if (primary.ratio !== null && primary.ratio >= 0.55) {
    return `${primary.category} +${spirits.length - 1}`;
  }

  return `复合基酒 ${spirits.length}款`;
}

function getBaseSpiritTagStyle(recipe: RecipeCard) {
  const primarySpirit =
    recipe.baseSpirits.find((spirit) => spirit.category !== "其他") ?? null;
  const category = primarySpirit?.category ?? recipe.baseSpiritCategory;
  const stage = getSpiritStage(category);
  const ratio = primarySpirit?.ratio ?? null;

  return {
    "--spirit-color": stage.accent,
    "--spirit-ratio": ratio === null ? "0%" : `${Math.round(Math.min(1, Math.max(0, ratio)) * 100)}%`,
    "--spirit-ratio-value": ratio === null ? 0 : Math.min(1, Math.max(0, ratio))
  } as CSSProperties;
}

function updateRecipeUrl(mood: MoodFilter, spirit: SpiritFilter) {
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

function getAvailableMoodFilters(recipes: RecipeCard[]) {
  return moodFilterRules
    .filter((rule) => rule.label === "全部" || recipes.some((recipe) => matchesMood(recipe, rule.label)))
    .map((rule) => rule.label);
}

function getDisplayTasteTags(recipe: RecipeCard) {
  const labels: string[] = [];
  const recipeText = getRecipeText(recipe);

  const addLabel = (label: string) => {
    if (!labels.includes(label)) {
      labels.push(label);
    }
  };

  if (recipe.balance.sour >= 4) {
    addLabel("酸爽");
  }

  if (recipe.balance.bitter >= 3) {
    addLabel("苦甜");
  }

  if (recipe.balance.spirit >= 5) {
    addLabel("酒感");
  }

  recipe.tags.forEach((tag) => {
    if (hiddenCardTagSlugs.has(tag.slug)) {
      return;
    }

    const label = getTagLabel(tag);

    if (label === "酒感" && recipe.balance.spirit < 5) {
      return;
    }

    addLabel(label);
  });

  if (recipeText.includes("苏打") || recipeText.includes("气泡") || recipeText.includes("soda")) {
    addLabel("气泡");
  }

  if (recipeText.includes("橙皮") || recipeText.includes("橙香") || recipeText.includes("orange")) {
    addLabel("橙香");
  }

  if (recipe.balance.spirit >= 4) {
    addLabel("酒感");
  }

  return labels.slice(0, 3);
}

function getTasteTagStyle(label: string, index: number) {
  const tone = tasteTagTones[label] ?? {
    paper: "#efe5db",
    border: "#b99c88",
    ink: "#514136"
  };

  return {
    "--tag-paper": tone.paper,
    "--tag-border": tone.border,
    "--tag-ink": tone.ink,
    "--tag-tilt": tasteTagTilts[index] ?? "0deg"
  } as CSSProperties;
}

export function RecipeCatalog({
  recipes,
  selectedMood,
  selectedSpirit
}: RecipeCatalogProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isFilterRailCompact, setIsFilterRailCompact] = useState(false);
  const [isFilterRailHidden, setIsFilterRailHidden] = useState(false);
  const lastScrollY = useRef(0);
  const availableMoodFilters = useMemo(() => getAvailableMoodFilters(recipes), [recipes]);
  const normalizedMood = normalizeMood(selectedMood, availableMoodFilters);
  const normalizedSpirit = normalizeSpirit(selectedSpirit);
  const [activeMood, setActiveMood] = useState<MoodFilter>(normalizedMood);
  const [activeSpirit, setActiveSpirit] = useState(normalizedSpirit);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(pageSize);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLocaleLowerCase());

  useEffect(() => {
    let animationFrame = 0;

    const syncFilterRail = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 24) {
        setIsFilterRailCompact(false);
        setIsFilterRailHidden(false);
      } else if (currentScrollY > 48) {
        setIsFilterRailCompact(true);

        if (Math.abs(scrollDelta) >= 2) {
          if (scrollDelta > 0 && currentScrollY > 180) {
            setIsFilterRailHidden(true);
          }

          if (scrollDelta < 0) {
            setIsFilterRailHidden(false);
          }
        }
      }

      lastScrollY.current = currentScrollY;
      animationFrame = 0;
    };

    const handleScroll = () => {
      if (animationFrame !== 0) {
        return;
      }

      animationFrame = window.requestAnimationFrame(syncFilterRail);
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const filteredRecipes = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          matchesMood(recipe, activeMood) &&
          (activeSpirit === "全部" ||
            recipe.baseSpiritCategory === activeSpirit ||
            recipe.baseSpirits.some((spirit) => spirit.category === activeSpirit)) &&
          matchesSearch(recipe, deferredSearchQuery)
      ),
    [activeMood, activeSpirit, deferredSearchQuery, recipes]
  );
  const visibleRecipes = filteredRecipes.slice(0, visibleLimit);

  const updateFilters = (mood: MoodFilter, spirit: SpiritFilter) => {
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
  const filterRailClassName = [
    "recipe-catalog-filter-rail",
    isFilterRailCompact ? "recipe-catalog-filter-rail--compact" : "",
    isFilterRailHidden ? "recipe-catalog-filter-rail--hidden" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="recipe-catalog-page">
      <div className="recipe-catalog-shell">
        <section className="recipe-catalog-intro" aria-labelledby="recipe-catalog-title">
          <h1 id="recipe-catalog-title">配方</h1>
          <p>今晚，想喝哪一杯？</p>
        </section>

        <section className={filterRailClassName} aria-label="筛选配方">
          <div className="recipe-catalog-filter-summary">
            <button
              className="recipe-catalog-filter-summary__toggle"
              type="button"
              aria-expanded={!isFilterRailCompact}
              aria-label="展开筛选"
              onClick={() => {
                setIsFilterRailCompact(false);
                setIsFilterRailHidden(false);
              }}
            >
              <span className="recipe-catalog-filter-summary__item">
                <span>口味</span>
                <strong>{activeMood}</strong>
              </span>
              <span className="recipe-catalog-filter-summary__item">
                <span>基酒</span>
                <strong>{activeSpirit}</strong>
              </span>
              <span className="recipe-catalog-filter-summary__action">筛选</span>
            </button>

            <label className="recipe-catalog-search recipe-catalog-search--compact">
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

          <div className="recipe-catalog-filter-row recipe-catalog-filter-row--primary">
            <span className="recipe-catalog-filter-label">口味</span>
            <div className="recipe-catalog-filter-main">
              <div className="recipe-catalog-filter-options" role="group" aria-label="按口味筛选">
                {availableMoodFilters.map((mood) => (
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
                {baseSpiritFilters.map((spirit) => (
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
              const stage = getSpiritStage(recipe.baseSpirits[0]?.category ?? recipe.baseSpiritCategory);
              const baseSpiritSummary = getBaseSpiritSummary(recipe);
              const tasteTags = getDisplayTasteTags(recipe);
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
                      <span
                        className="recipe-catalog-card__spirit-tag"
                        aria-label={`基酒：${baseSpiritSummary}`}
                        style={getBaseSpiritTagStyle(recipe)}
                      >
                        <span className="recipe-catalog-card__spirit-tag-text">
                          {baseSpiritSummary}
                        </span>
                      </span>
                    </span>

                    <span className="recipe-catalog-card__tags" aria-label="口味标签">
                      {tasteTags.map((tag, index) => (
                        <span
                          key={tag}
                          className="recipe-catalog-card__taste-tag"
                          style={getTasteTagStyle(tag, index)}
                        >
                          {tag}
                        </span>
                      ))}
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
