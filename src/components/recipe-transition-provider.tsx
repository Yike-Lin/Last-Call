"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  imageAlt: string;
  imageUrl: string;
  sourceElement: HTMLElement;
  theme: TransitionTheme;
};

type ActiveTransition = Omit<TransitionRequest, "sourceElement"> & {
  id: number;
  phase: "exiting" | "entering";
  sourceElement: HTMLElement;
  sourceRect: DOMRect;
  targetRect?: DOMRect;
};

type RecipeTransitionContextValue = {
  isTransitioningTo: (slug: string) => boolean;
  startRecipeTransition: (request: TransitionRequest) => void;
};

const recipeTransitionContext = createContext<RecipeTransitionContextValue | null>(null);

const liquidPathStart =
  "M 0 900 C 210 842 340 888 518 848 C 720 804 834 878 1032 842 C 1214 810 1330 850 1440 818 L 1440 900 L 0 900 Z";
const liquidPathRise =
  "M 0 518 C 192 422 364 602 548 496 C 734 386 890 570 1056 458 C 1214 352 1338 468 1440 402 L 1440 900 L 0 900 Z";
const liquidPathSettle =
  "M 0 796 C 192 742 360 822 546 778 C 744 730 892 806 1062 762 C 1210 724 1330 782 1440 740 L 1440 900 L 0 900 Z";

function isLocalRecipeImage(imageUrl: string) {
  return imageUrl.startsWith("http://127.0.0.1") || imageUrl.startsWith("http://localhost");
}

export function RecipeTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const liquidPathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const transitionSequence = useRef(0);
  const [transition, setTransition] = useState<ActiveTransition | null>(null);

  const startRecipeTransition = useCallback(
    (request: TransitionRequest) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion || transition) {
        router.push(request.href);
        return;
      }

      const sourceRect = request.sourceElement.getBoundingClientRect();

      if (sourceRect.width === 0 || sourceRect.height === 0) {
        router.push(request.href);
        return;
      }

      request.sourceElement.style.opacity = "0";
      transitionSequence.current += 1;
      setTransition({
        ...request,
        id: transitionSequence.current,
        phase: "exiting",
        sourceRect
      });
    },
    [router, transition]
  );

  useEffect(() => {
    if (!transition || transition.phase !== "exiting" || pathname !== transition.href) {
      return;
    }

    let animationFrame = 0;
    let attempts = 0;

    const findTarget = () => {
      const target = document.querySelector<HTMLElement>("[data-recipe-transition-target]");

      if (target) {
        const targetRect = target.getBoundingClientRect();

        if (targetRect.width > 0 && targetRect.height > 0) {
          setTransition((current) =>
            current && current.id === transition.id
              ? { ...current, phase: "entering", targetRect }
              : current
          );
          return;
        }
      }

      attempts += 1;

      if (attempts < 12) {
        animationFrame = window.requestAnimationFrame(findTarget);
      }
    };

    animationFrame = window.requestAnimationFrame(findTarget);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [pathname, transition]);

  useGSAP(
    () => {
      if (!transition || !overlayRef.current || !imageRef.current || !liquidPathRef.current) {
        return;
      }

      const overlay = overlayRef.current;
      const image = imageRef.current;
      const liquidPath = liquidPathRef.current;

      // Route rendering can overlap the exit beat. Freeze the previous beat at its
      // current visual state, then let the next one take over from that position.
      animationRef.current?.kill();
      gsap.killTweensOf([overlay, image, liquidPath]);

      if (transition.phase === "exiting") {
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(image, {
          borderRadius: 8,
          height: transition.sourceRect.height,
          left: transition.sourceRect.left,
          scale: 1,
          top: transition.sourceRect.top,
          width: transition.sourceRect.width
        });
        gsap.set(liquidPath, { attr: { d: liquidPathStart }, opacity: 0.42 });

        const timeline = gsap.timeline();
        animationRef.current = timeline;

        timeline
          .to(liquidPath, {
            attr: { d: liquidPathRise },
            duration: 0.78,
            ease: "power3.inOut"
          })
          .to(
            image,
            {
              duration: 0.52,
              ease: "power2.inOut",
              scale: 1.035
            },
            0
          )
          .call(() => router.push(transition.href), [], 0.32);

        return () => {
          if (animationRef.current === timeline) {
            timeline.kill();
          }
        };
      }

      if (!transition.targetRect) {
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          transition.sourceElement.style.opacity = "";
          animationRef.current = null;
          setTransition((current) => (current?.id === transition.id ? null : current));
        }
      });
      animationRef.current = timeline;

      timeline
        .to(
          image,
          {
            borderRadius: 0,
            duration: 1.02,
            ease: "power3.inOut",
            height: transition.targetRect.height,
            left: transition.targetRect.left,
            scale: 1,
            top: transition.targetRect.top,
            width: transition.targetRect.width
          },
          0
        )
        .to(
          liquidPath,
          {
            attr: { d: liquidPathSettle },
            duration: 1.08,
            ease: "power3.inOut"
          },
          0
        )
        .to(overlay, { autoAlpha: 0, duration: 0.34, ease: "power1.out" }, 0.78);

      return () => {
        if (animationRef.current === timeline) {
          timeline.kill();
        }
      };
    },
    {
      dependencies: [transition?.id, transition?.phase],
      revertOnUpdate: false,
      scope: overlayRef
    }
  );

  const contextValue: RecipeTransitionContextValue = {
    isTransitioningTo: (slug) => transition?.slug === slug,
    startRecipeTransition
  };

  return (
    <recipeTransitionContext.Provider value={contextValue}>
      {children}
      {transition ? (
        <div
          ref={overlayRef}
          className="recipe-transition-overlay"
          style={
            {
              "--recipe-transition-accent": transition.theme.accent,
              "--recipe-transition-wash": transition.theme.wash
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <svg className="recipe-transition-overlay__liquid" viewBox="0 0 1440 900" preserveAspectRatio="none">
            <path ref={liquidPathRef} />
          </svg>
          <div ref={imageRef} className="recipe-transition-overlay__image">
            <Image
              src={transition.imageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              unoptimized={isLocalRecipeImage(transition.imageUrl)}
            />
          </div>
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
