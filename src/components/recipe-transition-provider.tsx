"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode
} from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

type TransitionTheme = {
  accent: string;
  wash: string;
};

type TransitionRequest = {
  slug: string;
  href: string;
  theme: TransitionTheme;
};

type ActiveTransition = TransitionRequest & {
  id: number;
};

type RecipeTransitionContextValue = {
  startRecipeTransition: (request: TransitionRequest) => void;
};

const recipeTransitionContext = createContext<RecipeTransitionContextValue | null>(null);

const numberOfPoints = 10;
const pointDelayMaximum = 0.16;
const baseLayerDelay = 0.11;
const waveDuration = 0.78;
const retreatDuration = 0.68;
const retreatStart = 1.08;

function getLiquidPath(points: number[]) {
  let path = `M 0 0 V ${points[0]} C`;

  for (let index = 0; index < numberOfPoints - 1; index += 1) {
    const point = ((index + 1) / (numberOfPoints - 1)) * 100;
    const controlPoint = point - 100 / (numberOfPoints - 1) / 2;

    path += ` ${controlPoint} ${points[index]} ${controlPoint} ${points[index + 1]} ${point} ${points[index + 1]}`;
  }

  return `${path} V 100 H 0 Z`;
}

export function RecipeTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const baseLiquidPathRef = useRef<SVGPathElement>(null);
  const accentLiquidPathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const basePointsRef = useRef<number[]>(Array(numberOfPoints).fill(100));
  const accentPointsRef = useRef<number[]>(Array(numberOfPoints).fill(100));
  const transitionSequence = useRef(0);
  const [transition, setTransition] = useState<ActiveTransition | null>(null);

  const startRecipeTransition = useCallback(
    (request: TransitionRequest) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion || transition) {
        router.push(request.href);
        return;
      }

      transitionSequence.current += 1;
      setTransition({
        ...request,
        id: transitionSequence.current
      });
    },
    [router, transition]
  );

  useGSAP(
    () => {
      if (
        !transition ||
        !overlayRef.current ||
        !baseLiquidPathRef.current ||
        !accentLiquidPathRef.current
      ) {
        return;
      }

      const overlay = overlayRef.current;
      const baseLiquidPath = baseLiquidPathRef.current;
      const accentLiquidPath = accentLiquidPathRef.current;
      const basePoints = basePointsRef.current;
      const accentPoints = accentPointsRef.current;

      const renderPaths = () => {
        baseLiquidPath.setAttribute("d", getLiquidPath(basePoints));
        accentLiquidPath.setAttribute("d", getLiquidPath(accentPoints));
      };

      animationRef.current?.kill();
      gsap.killTweensOf([overlay, baseLiquidPath, accentLiquidPath]);

      basePoints.fill(100);
      accentPoints.fill(100);
      renderPaths();
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set([baseLiquidPath, accentLiquidPath], { autoAlpha: 1 });

      const pointDelays = Array.from({ length: numberOfPoints }, () =>
        gsap.utils.random(0, pointDelayMaximum)
      );

      const timeline = gsap.timeline({
        defaults: {
          duration: waveDuration,
          ease: "power2.inOut"
        },
        onUpdate: renderPaths,
        onComplete: () => {
          animationRef.current = null;
          setTransition((current) => (current?.id === transition.id ? null : current));
        }
      });
      animationRef.current = timeline;

      pointDelays.forEach((delay, index) => {
        timeline.to(accentPoints, { [index]: 0 }, delay);
        timeline.to(basePoints, { [index]: 0 }, delay + baseLayerDelay);
      });

      timeline.call(() => router.push(transition.href), [], 0.3);

      pointDelays.forEach((delay, index) => {
        timeline.to(
          accentPoints,
          { [index]: 100, duration: retreatDuration },
          retreatStart + delay * 0.72
        );
        timeline.to(
          basePoints,
          { [index]: 100, duration: retreatDuration },
          retreatStart + baseLayerDelay + delay * 0.72
        );
      });

      timeline
        .to(baseLiquidPath, { autoAlpha: 0, duration: 0.66, ease: "sine.inOut" }, retreatStart - 0.06)
        .to(accentLiquidPath, { autoAlpha: 0, duration: 0.5, ease: "sine.out" }, retreatStart + 0.12);

      return () => {
        if (animationRef.current === timeline) {
          timeline.kill();
        }
      };
    },
    {
      dependencies: [transition?.id],
      revertOnUpdate: false,
      scope: overlayRef
    }
  );

  const contextValue: RecipeTransitionContextValue = { startRecipeTransition };

  return (
    <recipeTransitionContext.Provider value={contextValue}>
      {children}
      {transition ? (
        <div
          ref={overlayRef}
          className="recipe-transition-overlay"
          aria-hidden="true"
        >
          <svg className="recipe-transition-overlay__liquid" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`recipe-transition-base-${transition.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8f8f3" />
                <stop offset="100%" stopColor={transition.theme.wash} />
              </linearGradient>
              <linearGradient id={`recipe-transition-accent-${transition.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={transition.theme.accent} />
                <stop offset="52%" stopColor={transition.theme.wash} />
                <stop offset="100%" stopColor="#f1f2ec" />
              </linearGradient>
            </defs>
            <path
              ref={baseLiquidPathRef}
              className="recipe-transition-overlay__liquid-base"
              fill={`url(#recipe-transition-base-${transition.id})`}
            />
            <path
              ref={accentLiquidPathRef}
              className="recipe-transition-overlay__liquid-accent"
              fill={`url(#recipe-transition-accent-${transition.id})`}
            />
          </svg>
        </div>
      ) : null}
    </recipeTransitionContext.Provider>
  );
}

export function useRecipeTransition() {
  const context = useContext(recipeTransitionContext);

  if (!context) {
    throw new Error("useRecipeTransition must be used within RecipeTransitionProvider.");
  }

  return context;
}
