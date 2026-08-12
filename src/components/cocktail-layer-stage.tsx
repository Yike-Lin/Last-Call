"use client";

import Image from "next/image";
import { type CSSProperties, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  cocktailSlots,
  type CocktailLayerKey,
  type CocktailSpec,
} from "@/lib/cocktail-specimens";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const bubbleOffsets = [
  { x: "47%", y: "67%", size: "5px", delay: 0 },
  { x: "53%", y: "73%", size: "3px", delay: 0.9 },
  { x: "59%", y: "58%", size: "4px", delay: 1.6 },
  { x: "42%", y: "61%", size: "3px", delay: 2.2 },
  { x: "63%", y: "78%", size: "3px", delay: 2.8 },
  { x: "50%", y: "49%", size: "2px", delay: 3.3 },
];

const imageLayerOrder: Array<{ key: CocktailLayerKey; className: string }> = [
  { key: "shadow", className: "tom-collins-stage__layer--shadow" },
  { key: "base", className: "tom-collins-stage__layer--base" },
  { key: "refraction", className: "tom-collins-stage__layer--refraction" },
  { key: "garnish", className: "tom-collins-stage__layer--lemon" },
  { key: "rim", className: "tom-collins-stage__layer--rim" },
];

type CocktailLayerStageProps = {
  cocktail: CocktailSpec;
};

export function CocktailLayerStage({ cocktail }: CocktailLayerStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const glass = glassRef.current;
      const sweep = sweepRef.current;
      const corridor = corridorRef.current;

      if (!stage || !glass || !sweep || !corridor || !cocktail.ready) return;

      const layerNodes = gsap.utils.toArray<HTMLElement>(
        ".tom-collins-stage__layer",
        stage,
      );
      const shadow = stage.querySelector<HTMLElement>(
        ".tom-collins-stage__layer--shadow",
      );
      const refraction = stage.querySelector<HTMLElement>(
        ".tom-collins-stage__layer--refraction",
      );
      const lemon = stage.querySelector<HTMLElement>(
        ".tom-collins-stage__layer--lemon",
      );
      const glints = gsap.utils.toArray<HTMLElement>(
        ".tom-collins-stage__ice-glint",
        stage,
      );
      const bubbleNodes = gsap.utils.toArray<HTMLElement>(
        ".tom-collins-stage__bubble",
        stage,
      );
      const corridorGlasses = gsap.utils.toArray<HTMLElement>(
        ".cocktail-corridor__glass",
        stage,
      );
      const corridorLens = stage.querySelector<HTMLElement>(
        ".cocktail-corridor__lens",
      );
      const section = stage.closest<HTMLElement>(".flavor-compass--cocktail");
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(glass, { autoAlpha: 1, scale: 1 });
        gsap.set(layerNodes, { autoAlpha: 1 });
        gsap.set(sweep, { autoAlpha: 0 });
        gsap.set(bubbleNodes, { autoAlpha: 0.6 });
        gsap.set(corridorGlasses, { autoAlpha: 0.34 });
        return;
      }

      gsap.set(glass, { autoAlpha: 0, scale: 0.55, transformOrigin: "50% 84%" });
      gsap.set(layerNodes, { autoAlpha: 0 });
      gsap.set(shadow, { autoAlpha: 0 });
      gsap.set(sweep, { autoAlpha: 0, xPercent: -120 });
      gsap.set(glints, { autoAlpha: 0, scale: 0.8 });
      gsap.set(bubbleNodes, { autoAlpha: 0 });
      gsap.set(corridorGlasses, { autoAlpha: 0.26 });
      if (corridorLens) gsap.set(corridorLens, { autoAlpha: 0 });

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: stage,
          start: "top 78%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      intro
        .to(glass, { autoAlpha: 1, duration: 0.36 })
        .to(layerNodes, { autoAlpha: 1, duration: 0.22, stagger: 0.06 }, "<0.08")
        .to(glass, { scale: 1, y: 0, duration: 1.02, ease: "expo.out" }, "<0.06")
        // The first frame must read as a complete specimen. The close-up begins
        // only after the user starts moving through the corridor.
        .to(glass, { scale: 1, duration: 0.68, ease: "power3.inOut" }, "-=0.12")
        .to(shadow, { autoAlpha: 0.78, duration: 0.3 }, "<0.12")
        .to(sweep, { autoAlpha: 0.72, duration: 0.16 }, "-=0.32")
        .to(sweep, { xPercent: 120, autoAlpha: 0, duration: 0.92, ease: "power2.inOut" }, "<")
        .to(glints, { autoAlpha: 0.8, scale: 1, duration: 0.24, stagger: 0.08 }, "-=0.46")
        .to(glints, { autoAlpha: 0, duration: 0.46, stagger: 0.07 }, ">-0.06")
        .to(bubbleNodes, { autoAlpha: 0.58, duration: 0.32, stagger: 0.07 }, "-=0.3");

      if (section) {
        const journey = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 1.1)}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.22,
            snap: {
              snapTo: "labelsDirectional",
              delay: 0.06,
              duration: { min: 0.14, max: 0.34 },
              ease: "power2.out",
            },
            invalidateOnRefresh: true,
          },
        });

        journey
          .addLabel("01", 0)
          .addLabel("02", 0.14)
          .addLabel("03", 0.28)
          .addLabel("04", 0.42)
          .addLabel("05", 0.56)
          .addLabel("06", 0.7)
          .addLabel("07", 0.84)
          .to(corridor, {
            xPercent: -11,
            rotationY: -10,
            rotationX: 3,
            transformOrigin: "70% 55%",
            ease: "none",
            duration: 1,
          }, 0)
          .to(
            glass,
            {
              xPercent: 17,
              yPercent: 10,
              scale: 1.82,
              autoAlpha: 0,
              ease: "none",
              duration: 0.14,
            },
            0,
          );

        corridorGlasses.forEach((corridorGlass, index) => {
          const beat = 0.14 + index * 0.14;

          journey
            .to(
              corridorGlass,
              {
                z: 360,
                scale: 1.28,
                rotationZ: -2,
                autoAlpha: 0.62,
                ease: "none",
                duration: 0.09,
              },
              beat,
            )
            .to(
              corridorGlass,
              {
                z: 680,
                scale: 1.58,
                rotationZ: -4,
                autoAlpha: 0,
                ease: "none",
                duration: 0.1,
              },
              beat + 0.09,
            );
        });

        if (corridorLens) {
          journey.to(
            corridorLens,
            { autoAlpha: 0.72, scale: 1.08, ease: "none", duration: 0.2 },
            0.72,
          );
        }
      }

      if (refraction) {
        gsap.to(refraction, {
          x: 5,
          y: -2,
          duration: 3.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      if (lemon) {
        gsap.to(lemon, {
          x: 3,
          rotation: 1.2,
          transformOrigin: "50% 82%",
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      gsap.to(glints, {
        y: -3,
        rotation: 3,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.32, from: "random" },
      });

      bubbleNodes.forEach((bubble, index) => {
        gsap.to(bubble, {
          y: -34 - (index % 3) * 11,
          x: index % 2 === 0 ? 3 : -4,
          autoAlpha: 0.12,
          duration: 2.8 + (index % 3) * 0.55,
          delay: bubbleOffsets[index]?.delay ?? 0,
          ease: "sine.inOut",
          repeat: -1,
          repeatDelay: 0.2,
          yoyo: true,
        });
      });
    },
    { scope: stageRef, dependencies: [cocktail.id], revertOnUpdate: true },
  );

  return (
    <div
      ref={stageRef}
      className="tom-collins-stage"
      style={{ "--cocktail-accent": cocktail.accent } as CSSProperties}
      aria-label={`${cocktail.index} ${cocktail.name} cocktail showcase`}
    >
      <div ref={corridorRef} className="cocktail-corridor" aria-hidden="true">
        <span className="cocktail-corridor__guide cocktail-corridor__guide--one" />
        <span className="cocktail-corridor__guide cocktail-corridor__guide--two" />
        <span className="cocktail-corridor__guide cocktail-corridor__guide--three" />
        <span className="cocktail-corridor__lens" />
        {cocktailSlots.map((slot, index) => {
          if (index === 0) return null;

          return (
            <div
              key={slot.id}
              className={`cocktail-corridor__glass cocktail-corridor__glass--${slot.index}`}
            >
              <span className="cocktail-corridor__silhouette" />
              <span className="cocktail-corridor__liquid" />
              <span>{slot.index}</span>
            </div>
          );
        })}
      </div>
      <div className="tom-collins-stage__orbit" aria-hidden="true" />
      <div className="tom-collins-stage__orbit tom-collins-stage__orbit--inner" aria-hidden="true" />

      {cocktail.ready ? (
        <div ref={glassRef} className="tom-collins-stage__glass" aria-hidden="true">
          {imageLayerOrder.map(({ key, className }) => {
            const src = cocktail.layers[key];
            if (!src) return null;

            return (
              <Image
                key={key}
                className={`tom-collins-stage__layer ${className}`}
                src={src}
                alt=""
                width={2400}
                height={3000}
                sizes="(max-width: 700px) 76vw, 40vw"
                unoptimized
              />
            );
          })}

          <span ref={sweepRef} className="tom-collins-stage__sweep" />
          <span className="tom-collins-stage__ice-glint tom-collins-stage__ice-glint--one" />
          <span className="tom-collins-stage__ice-glint tom-collins-stage__ice-glint--two" />
          <span className="tom-collins-stage__ice-glint tom-collins-stage__ice-glint--three" />

          {bubbleOffsets.map((bubble) => (
            <span
              key={`${bubble.x}-${bubble.y}`}
              className="tom-collins-stage__bubble"
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="tom-collins-stage__placeholder" aria-hidden="true">
          <span>{cocktail.index} / IN PREP</span>
          <strong>{cocktail.name}</strong>
        </div>
      )}

      <div className="tom-collins-stage__caption">
        <span>{cocktail.index} / {cocktail.label}</span>
        <strong>{cocktail.name}</strong>
        <small>{cocktail.note.replaceAll(" / ", " · ")}</small>
      </div>
    </div>
  );
}
