"use client";

import { useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import styles from "./hero-pour-scene.module.css";

gsap.registerPlugin(useGSAP);

const TICK_COUNT = 61;
// Reveal the filled image from the glass rim at max progress so no empty band remains.
const LIQUID_TOP_INSET = 0;
const LIQUID_BOTTOM_INSET = 76;
const AUTO_POUR_PROGRESS = 0.72;
const GARNISH_DROP_PROGRESS = 0.68;
const GARNISH_DROP_DURATION = 0.58;
const GARNISH_START_Y_PERCENT = -420;
const GARNISH_START_ROTATION = -18;
const GARNISH_END_ROTATION = 7;
const KEYBOARD_STEP = 0.06;
const KEYBOARD_BIG_STEP = 0.16;

type PourRulerProps = {
  knobRef: RefObject<HTMLSpanElement | null>;
  rulerRef: RefObject<HTMLDivElement | null>;
  onKnobKeyDown: (event: KeyboardEvent<HTMLSpanElement>) => void;
  onKnobPointerCancel: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  onKnobPointerDown: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  onKnobPointerMove: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  onKnobPointerUp: (event: ReactPointerEvent<HTMLSpanElement>) => void;
};

function PourRuler({
  knobRef,
  rulerRef,
  onKnobKeyDown,
  onKnobPointerCancel,
  onKnobPointerDown,
  onKnobPointerMove,
  onKnobPointerUp
}: PourRulerProps) {
  return (
    <div className={styles.ruler} ref={rulerRef}>
      <svg
        className={styles.rulerSvg}
        viewBox="0 0 86 520"
        role="presentation"
        aria-hidden="true"
      >
        <line className={styles.rulerAxis} x1="43" y1="0" x2="43" y2="520" />
        {Array.from({ length: TICK_COUNT }, (_, index) => {
          const y = (index / (TICK_COUNT - 1)) * 520;
          const isMajor = index % 10 === 0;
          const isMid = index % 5 === 0;
          const length = isMajor ? 30 : isMid ? 21 : 13;

          return (
            <line
              key={index}
              className={isMajor ? styles.rulerTickMajor : styles.rulerTick}
              x1={43 - length / 2}
              y1={y}
              x2={43 + length / 2}
              y2={y}
            />
          );
        })}
      </svg>

      <span
        ref={knobRef}
        className={styles.knobPreview}
        role="slider"
        tabIndex={0}
        aria-label="Pour level"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        onKeyDown={onKnobKeyDown}
        onPointerCancel={onKnobPointerCancel}
        onPointerDown={onKnobPointerDown}
        onPointerMove={onKnobPointerMove}
        onPointerUp={onKnobPointerUp}
      >
        <span className={styles.knobCrosshair} />
      </span>
    </div>
  );
}

export function HeroPourScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const filledLayerRef = useRef<HTMLDivElement>(null);
  const garnishRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const autoplayRef = useRef<gsap.core.Tween | null>(null);
  const garnishTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const garnishDroppedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const getTrackHeight = () => rulerRef.current?.getBoundingClientRect().height ?? 0;

  const resetGarnish = () => {
    const garnish = garnishRef.current;

    if (!garnish) {
      return;
    }

    garnishTimelineRef.current?.kill();
    garnishTimelineRef.current = null;
    garnishDroppedRef.current = false;
    gsap.set(garnish, {
      autoAlpha: 0,
      x: 30,
      yPercent: GARNISH_START_Y_PERCENT,
      rotation: GARNISH_START_ROTATION,
      scale: 0.9
    });
  };

  const dropGarnish = () => {
    const garnish = garnishRef.current;

    if (!garnish || garnishDroppedRef.current) {
      return;
    }

    garnishTimelineRef.current?.kill();
    garnishDroppedRef.current = true;

    if (reducedMotionRef.current) {
      gsap.set(garnish, {
        autoAlpha: 1,
        x: 0,
        yPercent: 0,
        rotation: GARNISH_END_ROTATION,
        scale: 1
      });
      return;
    }

    garnishTimelineRef.current = gsap.timeline({
      defaults: {
        ease: "power2.out"
      }
    });
    garnishTimelineRef.current
      .set(garnish, {
        autoAlpha: 0,
        x: 30,
        yPercent: GARNISH_START_Y_PERCENT,
        rotation: GARNISH_START_ROTATION,
        scale: 0.9
      })
      .to(garnish, { autoAlpha: 1, duration: 0.12, ease: "sine.out" }, 0)
      .to(
        garnish,
        {
          x: 0,
          yPercent: 0,
          rotation: GARNISH_END_ROTATION,
          scale: 1,
          duration: GARNISH_DROP_DURATION
        },
        0
      );
  };

  const renderProgress = (nextProgress: number) => {
    const knob = knobRef.current;
    const filledLayer = filledLayerRef.current;
    const trackHeight = getTrackHeight();
    const progress = gsap.utils.clamp(0, 1, nextProgress);

    progressRef.current = progress;

    if (!knob || !filledLayer || !trackHeight) {
      return;
    }

    const topInset = gsap.utils.interpolate(LIQUID_BOTTOM_INSET, LIQUID_TOP_INSET, progress);
    const bottomInset = 100 - LIQUID_BOTTOM_INSET;

    gsap.set(knob, {
      y: -trackHeight * progress
    });
    gsap.set(filledLayer, {
      autoAlpha: progress <= 0.01 ? 0 : 1,
      clipPath: `inset(${topInset}% 0 ${bottomInset}% 0)`
    });
    knob.setAttribute("aria-valuenow", String(Math.round(progress * 100)));

    if (progress >= GARNISH_DROP_PROGRESS) {
      dropGarnish();
    }
  };

  const getPointerProgress = (clientY: number) => {
    const ruler = rulerRef.current;

    if (!ruler) {
      return progressRef.current;
    }

    const rect = ruler.getBoundingClientRect();

    return gsap.utils.clamp(0, 1, (rect.bottom - clientY) / rect.height);
  };

  const stopAutoplay = () => {
    autoplayRef.current?.kill();
    autoplayRef.current = null;
  };

  useGSAP(
    () => {
      const filledLayer = filledLayerRef.current;
      const knob = knobRef.current;

      if (!filledLayer || !knob) {
        return;
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const progressDriver = { value: 0 };

      reducedMotionRef.current = reducedMotion;
      resetGarnish();
      renderProgress(0);

      if (reducedMotion) {
        return;
      }

      autoplayRef.current = gsap.to(progressDriver, {
        value: AUTO_POUR_PROGRESS,
        delay: 0.38,
        duration: 2.35,
        ease: "power2.inOut",
        onUpdate: () => renderProgress(progressDriver.value),
        onComplete: () => {
          autoplayRef.current = null;
        }
      });

      return () => {
        autoplayRef.current?.kill();
        autoplayRef.current = null;
        garnishTimelineRef.current?.kill();
        garnishTimelineRef.current = null;
      };
    },
    { scope: sceneRef }
  );

  const handleKnobPointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    stopAutoplay();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
    renderProgress(getPointerProgress(event.clientY));
  };

  const handleKnobPointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    renderProgress(getPointerProgress(event.clientY));
  };

  const handleKnobPointerUp = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    delete event.currentTarget.dataset.dragging;
  };

  const handleKnobKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    const currentProgress = progressRef.current;
    let nextProgress = currentProgress;

    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      nextProgress += KEYBOARD_STEP;
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      nextProgress -= KEYBOARD_STEP;
    } else if (event.key === "PageUp") {
      nextProgress += KEYBOARD_BIG_STEP;
    } else if (event.key === "PageDown") {
      nextProgress -= KEYBOARD_BIG_STEP;
    } else if (event.key === "Home") {
      nextProgress = 0;
    } else if (event.key === "End") {
      nextProgress = 1;
    } else {
      return;
    }

    event.preventDefault();
    stopAutoplay();
    renderProgress(gsap.utils.clamp(0, 1, nextProgress));
  };

  return (
    <div ref={sceneRef} className={styles.scene}>
      <PourRuler
        knobRef={knobRef}
        rulerRef={rulerRef}
        onKnobKeyDown={handleKnobKeyDown}
        onKnobPointerCancel={handleKnobPointerUp}
        onKnobPointerDown={handleKnobPointerDown}
        onKnobPointerMove={handleKnobPointerMove}
        onKnobPointerUp={handleKnobPointerUp}
      />

      <div className={styles.glassStage}>
        <span className={styles.groundShadow} />

        <div className={`${styles.glassLayer} ${styles.glassLayerEmpty}`}>
          <Image
            src="/images/hero-pour/glass-empty-v1.png"
            alt=""
            fill
            sizes="(max-width: 1180px) 42vw, 504px"
            priority
          />
        </div>

        <div
          ref={filledLayerRef}
          className={`${styles.glassLayer} ${styles.glassLayerFilled}`}
          aria-hidden="true"
        >
          <Image
            src="/images/hero-pour/glass-filled-v1.png"
            alt=""
            fill
            sizes="(max-width: 1180px) 42vw, 504px"
          />
        </div>

        <span ref={garnishRef} className={styles.garnish} aria-hidden="true">
          <Image
            className={styles.garnishImage}
            src="/images/hero-pour/orange-peel-v2.png"
            alt=""
            fill
            sizes="(max-width: 1180px) 12vw, 126px"
          />
        </span>
      </div>
    </div>
  );
}
