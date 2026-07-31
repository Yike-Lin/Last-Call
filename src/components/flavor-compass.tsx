"use client";

import type { CSSProperties } from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { moodFilterRules, type MoodFilter } from "@/lib/taste-filters";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const moodVisuals: Record<MoodFilter, { accent: string; glow: string; note: string }> = {
  全部: { accent: "#f2e7d5", glow: "rgba(242, 231, 213, 0.2)", note: "把今晚交给直觉" },
  清爽: { accent: "#9fb4ad", glow: "rgba(159, 180, 173, 0.3)", note: "冰冷、轻盈、像第一口空气" },
  酸爽: { accent: "#c9d7bd", glow: "rgba(201, 215, 189, 0.28)", note: "明亮的酸度先醒过来" },
  苦甜: { accent: "#c95c40", glow: "rgba(201, 92, 64, 0.34)", note: "苦味和甜感彼此拉扯" },
  草本: { accent: "#707a58", glow: "rgba(112, 122, 88, 0.32)", note: "绿色香气在杯口停留" },
  果香: { accent: "#c98270", glow: "rgba(201, 130, 112, 0.32)", note: "让果香把夜色推向明处" },
  香料: { accent: "#a56d50", glow: "rgba(165, 109, 80, 0.34)", note: "温热的香气慢慢展开" },
  酒感: { accent: "#a76a4d", glow: "rgba(167, 106, 77, 0.36)", note: "酒体向前，适合慢慢喝" }
};

const moodPositions: Record<MoodFilter, { x: string; y: string }> = {
  全部: { x: "50%", y: "7%" },
  清爽: { x: "16%", y: "22%" },
  酸爽: { x: "7%", y: "46%" },
  苦甜: { x: "16%", y: "71%" },
  草本: { x: "34%", y: "88%" },
  果香: { x: "84%", y: "22%" },
  香料: { x: "93%", y: "46%" },
  酒感: { x: "84%", y: "71%" }
};

function getMoodHref(mood: MoodFilter) {
  return mood === "全部" ? "/recipes" : `/recipes?mood=${encodeURIComponent(mood)}`;
}

export function FlavorCompass() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const [highlightedMood, setHighlightedMood] = useState<MoodFilter>("全部");
  const highlightedVisual = moodVisuals[highlightedMood];

  useGSAP(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const glass = glassRef.current;

    if (!root || !stage || !glass) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const introItems = gsap.utils.toArray<HTMLElement>(
      ".flavor-compass__intro, .flavor-compass__option, .flavor-compass__caption",
      root
    );

    if (reduceMotion) {
      gsap.set(introItems, { autoAlpha: 1, clearProps: "transform" });
      gsap.set(glass, { autoAlpha: 1, clearProps: "transform" });
      return;
    }

    gsap.set(introItems, { autoAlpha: 0, y: 26 });
    gsap.set(glass, { autoAlpha: 0.94, scale: 0.92, y: 24, transformOrigin: "50% 50%" });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 78%",
        end: "bottom 72%",
        scrub: 1
      }
    });

    timeline
      .to(".flavor-compass__intro", { autoAlpha: 1, y: 0, duration: 0.3 }, 0)
      .to(glass, { autoAlpha: 0.78, scale: 0.72, y: 48, rotationZ: -3, duration: 0.8 }, 0.05)
      .to(
        ".flavor-compass__option",
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
        0.18
      )
      .to(".flavor-compass__caption", { autoAlpha: 1, y: 0, duration: 0.4 }, 0.38);

    return () => timeline.kill();
  }, { scope: rootRef });

  const handleMoodFocus = (mood: MoodFilter) => setHighlightedMood(mood);

  return (
    <section
      className="flavor-compass"
      ref={rootRef}
      aria-labelledby="flavor-compass-title"
      style={
        {
          "--flavor-accent": highlightedVisual.accent,
          "--flavor-glow": highlightedVisual.glow
        } as CSSProperties
      }
    >
      <div className="flavor-compass__wash" aria-hidden="true" />
      <div className="flavor-compass__shell">
        <div className="flavor-compass__intro">
          <div>
            <p className="flavor-compass__eyebrow">02 / FLAVOR COMPASS</p>
            <h2 id="flavor-compass-title">WHAT ARE YOU IN THE MOOD FOR?</h2>
            <p className="flavor-compass__lede">今晚，你更接近哪一种味道？</p>
          </div>
          <div className="flavor-compass__signal" aria-live="polite">
            <span>NOW SELECTING</span>
            <strong>{highlightedMood}</strong>
            <small>{highlightedVisual.note}</small>
          </div>
        </div>

        <div className="flavor-compass__stage" ref={stageRef}>
          <div className="flavor-compass__track" aria-hidden="true" />
          <div className="flavor-compass__glass" ref={glassRef} aria-hidden="true">
            <Image src="/svg/hero-glass-shadow.svg" alt="" fill sizes="360px" className="flavor-compass__layer flavor-compass__layer--shadow" />
            <Image src="/svg/hero-glass-liquid.svg" alt="" fill sizes="360px" className="flavor-compass__layer flavor-compass__layer--liquid" />
            <Image src="/svg/hero-ice.svg" alt="" fill sizes="360px" className="flavor-compass__layer flavor-compass__layer--ice" />
            <Image src="/svg/hero-splash.svg" alt="" fill sizes="360px" className="flavor-compass__layer flavor-compass__layer--splash" />
            <Image src="/svg/hero-bubbles.svg" alt="" fill sizes="360px" className="flavor-compass__layer flavor-compass__layer--bubbles" />
            <Image src="/svg/hero-glass-outline.svg" alt="" fill sizes="360px" className="flavor-compass__layer flavor-compass__layer--outline" />
            <Image src="/svg/hero-garnish.svg" alt="" fill sizes="360px" className="flavor-compass__layer flavor-compass__layer--garnish" />
          </div>

          <div className="flavor-compass__options" role="group" aria-label="按口味筛选配方">
            {moodFilterRules.map(({ label }) => {
              const visual = moodVisuals[label];
              const position = moodPositions[label];

              return (
                <Link
                  key={label}
                  className={`flavor-compass__option${highlightedMood === label ? " is-active" : ""}`}
                  href={getMoodHref(label)}
                  style={
                    {
                      "--option-x": position.x,
                      "--option-y": position.y,
                      "--option-accent": visual.accent
                    } as CSSProperties
                  }
                  onPointerEnter={() => handleMoodFocus(label)}
                  onFocus={() => handleMoodFocus(label)}
                  onPointerLeave={() => setHighlightedMood("全部")}
                  onBlur={() => setHighlightedMood("全部")}
                >
                  <span className="flavor-compass__option-dot" aria-hidden="true" />
                  <span>{label}</span>
                  <small>{label === "全部" ? "VIEW ALL" : "EXPLORE"}</small>
                </Link>
              );
            })}
          </div>

          <div className="flavor-compass__caption" aria-hidden="true">
            <span>THE GLASS MOVES BACK</span>
            <strong>YOUR TASTE MOVES FORWARD</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
