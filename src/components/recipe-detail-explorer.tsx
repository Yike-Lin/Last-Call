"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RecipeCard } from "@/lib/recipes";

type RecipeAnnotation = {
  id: string;
  order: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  x: number;
  y: number;
  ingredientSlugs?: string[];
  stepActions?: string[];
  detail?: string;
};

const recipeAnnotations: Record<string, RecipeAnnotation[]> = {
  mojito: [
    {
      id: "mint-aroma",
      order: "01",
      label: "薄荷香气",
      eyebrow: "AROMA LAYER",
      title: "从杯口先抵达的薄荷",
      description: "薄荷不需要被捣碎。轻压，让青草和清凉感留在第一口，而不是变成杂味。",
      x: 40,
      y: 20,
      ingredientSlugs: ["mint"],
      stepActions: ["muddle", "garnish"],
      detail: "8 片叶，轻压后再以新鲜薄荷收尾"
    },
    {
      id: "lime-acidity",
      order: "02",
      label: "青柠酸度",
      eyebrow: "BRIGHTNESS",
      title: "酸度把整杯拉亮",
      description: "现榨青柠提供清晰的骨架，让糖浆只负责圆润，而不把这杯酒推向甜腻。",
      x: 29,
      y: 49,
      ingredientSlugs: ["lime-juice", "simple-syrup"],
      stepActions: ["muddle"],
      detail: "20 ml 鲜榨青柠汁，配 15 ml 糖浆"
    },
    {
      id: "rum-spine",
      order: "03",
      label: "朗姆骨架",
      eyebrow: "SPIRIT CORE",
      title: "轻盈，但不失去酒体",
      description: "白朗姆是这杯的中轴。它保持干净的甘蔗底色，也把酸、甜、气泡连接成完整的酒体。",
      x: 47,
      y: 53,
      ingredientSlugs: ["white-rum"],
      stepActions: ["build"],
      detail: "45 ml 白朗姆，维持清爽的 11% ABV"
    },
    {
      id: "crushed-ice",
      order: "04",
      label: "碎冰温度",
      eyebrow: "TEXTURE",
      title: "碎冰负责稀释，也负责节奏",
      description: "填满的碎冰让温度迅速下降，入口从容变轻，整杯会在饮用过程中缓慢打开。",
      x: 57,
      y: 68,
      stepActions: ["build"],
      detail: "碎冰填满海波杯"
    },
    {
      id: "sparkling-finish",
      order: "05",
      label: "气泡收尾",
      eyebrow: "FINISH",
      title: "最后一层，是会消失的气泡",
      description: "苏打水最后加入，轻轻提拉而不是搅散。它把薄荷香和青柠酸带到更轻、更长的尾韵。",
      x: 68,
      y: 35,
      ingredientSlugs: ["soda-water"],
      stepActions: ["top"],
      detail: "加满苏打水，轻提混合"
    }
  ]
};

function getFallbackAnnotation(recipe: RecipeCard): RecipeAnnotation {
  return {
    id: "recipe-note",
    order: "",
    label: "配方说明",
    eyebrow: "RECIPE NOTE",
    title: "这杯酒的结构",
    description: recipe.summary,
    x: 0,
    y: 0,
    ingredientSlugs: recipe.ingredients.slice(0, 2).map((ingredient) => ingredient.slug),
    stepActions: recipe.detailedSteps
      .slice(0, 1)
      .flatMap((step) => (step.actionType ? [step.actionType] : [])),
    detail: `${recipe.method} · ${recipe.glassware}`
  };
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

function formatTotalDuration(seconds: number | null) {
  if (seconds === null) {
    return "按步骤完成";
  }

  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${String(minutes).padStart(2, "0")} 分钟`;
}

function isRelated(target: string | null, relatedTargets: string[] | undefined) {
  return Boolean(target && relatedTargets?.includes(target));
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
  const annotations = recipeAnnotations[recipe.slug] ?? [];
  const fallbackAnnotation = getFallbackAnnotation(recipe);
  const [selectedId, setSelectedId] = useState(annotations[0]?.id ?? fallbackAnnotation.id);
  const selectedAnnotation =
    annotations.find((annotation) => annotation.id === selectedId) ?? fallbackAnnotation;
  const hasImageAnnotations = annotations.length > 0;

  const relatedIngredientSlugs = selectedAnnotation.ingredientSlugs;
  const relatedStepActions = selectedAnnotation.stepActions;

  return (
    <main className="recipe-detail-page">
      <div className="recipe-detail-shell">
        <header className="recipe-detail-heading">
          <div>
            <h1
              style={
                recipe.name.length >= 12
                  ? { fontSize: "4.1rem", lineHeight: 1 }
                  : undefined
              }
            >
              {recipe.name}
            </h1>
          </div>
          <p>{recipe.summary}</p>
        </header>

        <section className="recipe-detail-explorer" aria-label={`${recipe.name} 配方探索`}>
          <div className="recipe-detail-specimen">
            <div className="recipe-detail-stage">
              {recipe.imageUrl ? (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.imageAlt ?? recipe.name}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 430px"
                  unoptimized={isLocalRecipeImage(recipe.imageUrl)}
                  className="recipe-detail-stage__image"
                />
              ) : (
                <div className="recipe-detail-stage__fallback" aria-hidden="true" />
              )}
              <div className="recipe-detail-stage__veil" aria-hidden="true" />

              {hasImageAnnotations ? (
                <>
                  <div className="recipe-detail-stage__markers" aria-label="风味与结构标注">
                    {annotations.map((annotation) => {
                      const isActive = annotation.id === selectedAnnotation.id;

                      return (
                        <button
                          key={annotation.id}
                          className={`recipe-detail-marker${isActive ? " is-active" : ""}`}
                          style={
                            {
                              "--annotation-x": `${annotation.x}%`,
                              "--annotation-y": `${annotation.y}%`
                            } as CSSProperties
                          }
                          type="button"
                          aria-pressed={isActive}
                          aria-label={`查看${annotation.label}`}
                          onClick={() => setSelectedId(annotation.id)}
                        >
                          <span>{annotation.order}</span>
                          <span className="recipe-detail-marker__tooltip">{annotation.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="recipe-detail-stage__caption">
                    <span>点击标注</span>
                    <strong>{selectedAnnotation.label}</strong>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <aside className="recipe-detail-console" aria-live="polite">
            <div className="recipe-detail-console__signal">
              <span>{selectedAnnotation.eyebrow}</span>
              {hasImageAnnotations ? (
                <span>
                  {selectedAnnotation.order} / {String(annotations.length).padStart(2, "0")}
                </span>
              ) : null}
            </div>

            <div className="recipe-detail-insight">
              <p>{selectedAnnotation.label}</p>
              <h2>{selectedAnnotation.title}</h2>
              <p>{selectedAnnotation.description}</p>
              {selectedAnnotation.detail ? (
                <span className="recipe-detail-insight__detail">{selectedAnnotation.detail}</span>
              ) : null}
            </div>

            <dl className="recipe-detail-facts">
              <div>
                <dt>调制</dt>
                <dd>{recipe.method}</dd>
              </div>
              <div>
                <dt>总时长</dt>
                <dd>{formatTotalDuration(recipe.prepTimeSeconds)}</dd>
              </div>
              <div>
                <dt>酒精度</dt>
                <dd>{recipe.estimatedAbv}</dd>
              </div>
            </dl>

            <section className="recipe-detail-list recipe-detail-list--ingredients" aria-labelledby="recipe-ingredients-title">
              <div className="recipe-detail-list__heading">
                <h2 id="recipe-ingredients-title">原料清单</h2>
                <span>{String(recipe.ingredients.length).padStart(2, "0")}</span>
              </div>
              <ol>
                {recipe.ingredients.map((ingredient, index) => {
                  const related = isRelated(ingredient.slug, relatedIngredientSlugs);

                  return (
                    <li
                      key={ingredient.slug}
                      className={`recipe-detail-ingredient-card${related ? " is-related" : ""}`}
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
                  const related = isRelated(step.actionType, relatedStepActions);
                  const duration = formatDuration(step.durationSeconds);

                  return (
                    <li key={step.stepNumber} className={related ? "is-related" : undefined}>
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
