"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RecipeCard } from "@/lib/recipes";
import { useRecipeTransition } from "@/components/recipe-transition-provider";

type IngredientAnchor = {
  ingredientSlug: string;
  x: number;
  y: number;
  label: string;
};

type IngredientConnection = {
  width: number;
  height: number;
  path: string;
  endX: number;
  endY: number;
};

const recipeIngredientAnchors: Record<string, IngredientAnchor[]> = {
  aviation: [
    { ingredientSlug: "gin", x: 50, y: 45, label: "酒液主体" },
    { ingredientSlug: "maraschino", x: 53, y: 40, label: "酒液主体" },
    { ingredientSlug: "lemon-juice", x: 61, y: 24, label: "杯口柑橘" },
    { ingredientSlug: "creme-de-violette", x: 47, y: 43, label: "淡紫酒液" }
  ],
  "clover-club": [
    { ingredientSlug: "gin", x: 50, y: 46, label: "粉红酒液" },
    { ingredientSlug: "raspberry-syrup", x: 51, y: 24, label: "覆盆子装饰" },
    { ingredientSlug: "lemon-juice", x: 43, y: 40, label: "粉红酒液" },
    { ingredientSlug: "egg-white", x: 50, y: 33, label: "泡沫层" }
  ],
  daiquiri: [
    { ingredientSlug: "white-rum", x: 50, y: 39, label: "澄澈酒液" },
    { ingredientSlug: "lime-juice", x: 65, y: 23, label: "青柠皮" },
    { ingredientSlug: "superfine-sugar", x: 46, y: 40, label: "澄澈酒液" }
  ],
  sidecar: [
    { ingredientSlug: "cognac", x: 50, y: 37, label: "琥珀酒液" },
    { ingredientSlug: "triple-sec", x: 66, y: 23, label: "橙皮香气" },
    { ingredientSlug: "lemon-juice", x: 46, y: 37, label: "琥珀酒液" }
  ],
  "old-fashioned": [
    { ingredientSlug: "bourbon", x: 50, y: 59, label: "琥珀酒液" },
    { ingredientSlug: "simple-syrup", x: 46, y: 62, label: "琥珀酒液" },
    { ingredientSlug: "angostura-bitters", x: 54, y: 55, label: "冰块与酒液" }
  ],
  "whiskey-sour": [
    { ingredientSlug: "bourbon", x: 50, y: 59, label: "金色酒液" },
    { ingredientSlug: "lemon-juice", x: 48, y: 55, label: "金色酒液" },
    { ingredientSlug: "simple-syrup", x: 44, y: 61, label: "金色酒液" },
    { ingredientSlug: "egg-white", x: 49, y: 39, label: "泡沫层" }
  ],
  negroni: [
    { ingredientSlug: "gin", x: 50, y: 58, label: "红色酒液" },
    { ingredientSlug: "campari", x: 54, y: 57, label: "红色酒液" },
    { ingredientSlug: "sweet-vermouth", x: 46, y: 57, label: "红色酒液" }
  ],
  "dry-martini": [
    { ingredientSlug: "gin", x: 49, y: 38, label: "澄澈酒液" },
    { ingredientSlug: "dry-vermouth", x: 45, y: 40, label: "澄澈酒液" }
  ],
  manhattan: [
    { ingredientSlug: "rye-whiskey", x: 50, y: 35, label: "深色酒液" },
    { ingredientSlug: "sweet-vermouth", x: 47, y: 36, label: "深色酒液" },
    { ingredientSlug: "angostura-bitters", x: 54, y: 39, label: "深色酒液" }
  ],
  margarita: [
    { ingredientSlug: "tequila-blanco", x: 50, y: 42, label: "青柠色酒液" },
    { ingredientSlug: "triple-sec", x: 46, y: 40, label: "青柠色酒液" },
    { ingredientSlug: "lime-juice", x: 66, y: 22, label: "青柠片" }
  ],
  mojito: [
    { ingredientSlug: "mint", x: 47, y: 21, label: "薄荷装饰" },
    { ingredientSlug: "lime-juice", x: 57, y: 39, label: "青柠与碎冰" },
    { ingredientSlug: "simple-syrup", x: 48, y: 53, label: "清爽酒液" },
    { ingredientSlug: "white-rum", x: 50, y: 52, label: "清爽酒液" },
    { ingredientSlug: "soda-water", x: 51, y: 33, label: "气泡层" }
  ],
  "moscow-mule": [
    { ingredientSlug: "vodka", x: 51, y: 48, label: "铜杯酒液" },
    { ingredientSlug: "ginger-beer", x: 48, y: 35, label: "冰块与气泡" },
    { ingredientSlug: "lime-juice", x: 69, y: 22, label: "青柠片" }
  ],
  "french-75": [
    { ingredientSlug: "gin", x: 50, y: 45, label: "金色酒液" },
    { ingredientSlug: "lemon-juice", x: 42, y: 16, label: "柠檬片" },
    { ingredientSlug: "simple-syrup", x: 48, y: 48, label: "金色酒液" },
    { ingredientSlug: "champagne", x: 50, y: 39, label: "气泡酒液" }
  ],
  boulevardier: [
    { ingredientSlug: "bourbon", x: 50, y: 60, label: "琥珀酒液" },
    { ingredientSlug: "campari", x: 54, y: 61, label: "琥珀酒液" },
    { ingredientSlug: "sweet-vermouth", x: 46, y: 61, label: "琥珀酒液" }
  ]
};

function getIngredientAnchors(recipe: RecipeCard) {
  return recipeIngredientAnchors[recipe.slug] ?? [];
}

function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    base: "基酒",
    modifier: "修饰",
    mixer: "补充",
    garnish: "装饰"
  };

  return labels[role] ?? role;
}

function getActionLabel(actionType: string | null) {
  const labels: Record<string, string> = {
    build: "直调",
    shake: "摇和",
    stir: "搅拌",
    muddle: "轻压",
    top: "补满",
    garnish: "装饰",
    strain: "滤入",
    prepare: "准备"
  };

  return actionType ? (labels[actionType] ?? actionType) : "步骤";
}

function formatDuration(seconds: number | null) {
  if (seconds === null) {
    return null;
  }

  if (seconds < 60) {
    return `${seconds} 秒`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds ? `${minutes} 分 ${remainingSeconds} 秒` : `${minutes} 分`;
}

function isLocalRecipeImage(imageUrl: string) {
  return (
    imageUrl.startsWith("http://127.0.0.1") ||
    imageUrl.startsWith("http://localhost")
  );
}

type RecipeDetailExplorerProps = {
  recipe: RecipeCard;
};

export function RecipeDetailExplorer({ recipe }: RecipeDetailExplorerProps) {
  const { isTransitioningTo } = useRecipeTransition();
  const workspaceRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ingredientElements = useRef(new Map<string, HTMLLIElement>());
  const [activeIngredientSlug, setActiveIngredientSlug] = useState<string | null>(null);
  const [connection, setConnection] = useState<IngredientConnection | null>(null);
  const ingredientAnchors = useMemo(() => getIngredientAnchors(recipe), [recipe]);
  const activeAnchor = ingredientAnchors.find(
    (anchor) => anchor.ingredientSlug === activeIngredientSlug
  );
  const isTransitioning = isTransitioningTo(recipe.slug);

  const updateConnection = useCallback(() => {
    if (!activeIngredientSlug || !activeAnchor) {
      setConnection(null);
      return;
    }

    const workspace = workspaceRef.current;
    const stage = stageRef.current;
    const ingredientCard = ingredientElements.current.get(activeIngredientSlug);

    if (!workspace || !stage || !ingredientCard) {
      setConnection(null);
      return;
    }

    const workspaceBounds = workspace.getBoundingClientRect();
    const stageBounds = stage.getBoundingClientRect();
    const cardBounds = ingredientCard.getBoundingClientRect();
    const width = workspaceBounds.width;
    const height = workspaceBounds.height;
    const startX = cardBounds.left - workspaceBounds.left + 8;
    const startY = cardBounds.top - workspaceBounds.top + cardBounds.height / 2;
    const endX = stageBounds.left - workspaceBounds.left + (stageBounds.width * activeAnchor.x) / 100;
    const endY = stageBounds.top - workspaceBounds.top + (stageBounds.height * activeAnchor.y) / 100;
    const controlDistance = Math.max(56, Math.abs(startX - endX) * 0.42);
    const path = `M ${startX} ${startY} C ${startX - controlDistance} ${startY}, ${endX + controlDistance} ${endY}, ${endX} ${endY}`;

    setConnection({ width, height, path, endX, endY });
  }, [activeAnchor, activeIngredientSlug]);

  useLayoutEffect(() => {
    const animationFrame = window.requestAnimationFrame(updateConnection);

    const workspace = workspaceRef.current;

    if (!workspace) {
      return () => window.cancelAnimationFrame(animationFrame);
    }

    const resizeObserver = new ResizeObserver(updateConnection);
    resizeObserver.observe(workspace);
    window.addEventListener("resize", updateConnection);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateConnection);
    };
  }, [updateConnection]);

  return (
    <main className={`recipe-detail-page${isTransitioning ? " is-transitioning" : ""}`}>
      <div className="recipe-detail-shell">
        <header className="recipe-detail-heading">
          <h1 className={recipe.name.length >= 12 ? "is-compact" : undefined}>{recipe.name}</h1>
          <p>{recipe.summary}</p>
        </header>

        <section
          ref={workspaceRef}
          className="recipe-detail-explorer"
          aria-label={`${recipe.name} 配方探索`}
        >
          {connection ? (
            <svg
              key={activeIngredientSlug}
              className="recipe-detail-connection"
              aria-hidden="true"
              viewBox={`0 0 ${connection.width} ${connection.height}`}
              preserveAspectRatio="none"
            >
              <path className="recipe-detail-connection__path" pathLength="1" d={connection.path} />
              <circle className="recipe-detail-connection__target" cx={connection.endX} cy={connection.endY} r="6" />
              <circle className="recipe-detail-connection__core" cx={connection.endX} cy={connection.endY} r="2" />
            </svg>
          ) : null}

          <div className="recipe-detail-specimen">
            <div ref={stageRef} data-recipe-transition-target className="recipe-detail-stage">
              {recipe.imageUrl ? (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.imageAlt ?? recipe.name}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 600px"
                  unoptimized={isLocalRecipeImage(recipe.imageUrl)}
                  className="recipe-detail-stage__image"
                />
              ) : (
                <div className="recipe-detail-stage__fallback" aria-hidden="true" />
              )}
              <div className="recipe-detail-stage__veil" aria-hidden="true" />
            </div>
          </div>

          <aside className="recipe-detail-console">
            <section className="recipe-detail-list recipe-detail-list--ingredients" aria-labelledby="recipe-ingredients-title">
              <div className="recipe-detail-list__heading">
                <h2 id="recipe-ingredients-title">原料清单</h2>
                <span>{String(recipe.ingredients.length).padStart(2, "0")}</span>
              </div>
              <ol>
                {recipe.ingredients.map((ingredient, index) => {
                  const isActive = ingredient.slug === activeIngredientSlug;
                  const anchor = ingredientAnchors.find(
                    (item) => item.ingredientSlug === ingredient.slug
                  );

                  return (
                    <li
                      key={ingredient.slug}
                      ref={(element) => {
                        if (element) {
                          ingredientElements.current.set(ingredient.slug, element);
                        } else {
                          ingredientElements.current.delete(ingredient.slug);
                        }
                      }}
                      className={`recipe-detail-ingredient-card${anchor ? " has-anchor" : ""}${isActive ? " is-active" : ""}`}
                      tabIndex={anchor ? 0 : undefined}
                      aria-label={anchor ? `${ingredient.name}，${anchor.label}` : undefined}
                      onPointerEnter={() => anchor && setActiveIngredientSlug(ingredient.slug)}
                      onPointerLeave={() => setActiveIngredientSlug(null)}
                      onFocus={() => anchor && setActiveIngredientSlug(ingredient.slug)}
                      onBlur={() => setActiveIngredientSlug(null)}
                    >
                      <span className="recipe-detail-list__index">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <div className="recipe-detail-list__line">
                          <strong>{ingredient.name}</strong>
                          <span>{ingredient.amount}</span>
                        </div>
                        <p>
                          {getRoleLabel(ingredient.role)}
                          {ingredient.preparationNote ? ` · ${ingredient.preparationNote}` : ""}
                          {ingredient.isOptional ? " · 可选" : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section className="recipe-detail-list recipe-detail-list--steps" aria-labelledby="recipe-steps-title">
              <div className="recipe-detail-list__heading">
                <h2 id="recipe-steps-title">制作步骤</h2>
                <span>{String(recipe.detailedSteps.length).padStart(2, "0")}</span>
              </div>
              <ol>
                {recipe.detailedSteps.map((step) => {
                  const duration = formatDuration(step.durationSeconds);

                  return (
                    <li key={step.stepNumber}>
                      <span className="recipe-detail-list__index">{String(step.stepNumber).padStart(2, "0")}</span>
                      <div>
                        <div className="recipe-detail-list__line">
                          <strong>{getActionLabel(step.actionType)}</strong>
                          {duration ? <span>{duration}</span> : null}
                        </div>
                        <p>{step.instruction}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            <Link href="/mix" className="recipe-detail-console__cta">
              开始调制
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}
