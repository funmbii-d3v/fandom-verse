import { useRef } from "react";
import { ScrollTrigger, gsap, useGSAP } from "../gsap.js";
import usePrefersReducedMotion from "./usePrefersReducedMotion.js";

export default function useScrollReveal(rootRef, watchKey = "") {
  const hasRevealed = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    (context, contextSafe) => {
      const root = rootRef.current;
      if (!root) return undefined;

      const getTargets = () => gsap.utils.toArray("[data-reveal]", root);
      const targets = getTargets();
      if (!targets.length) return undefined;

      if (prefersReducedMotion) {
        gsap.set(targets, { autoAlpha: 1, clearProps: "transform" });
        hasRevealed.current = true;
        return undefined;
      }

      if (hasRevealed.current) {
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.44,
            stagger: 0.06,
            ease: "power2.out",
            overwrite: "auto",
            clearProps: "transform",
          },
        );
        return undefined;
      }

      const revealOnEnter = contextSafe(() => {
        hasRevealed.current = true;
        const currentTargets = getTargets();
        gsap.fromTo(
          currentTargets,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.08,
            ease: "power2.out",
            overwrite: "auto",
            clearProps: "transform",
          },
        );
      });

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top 84%",
        once: true,
        onEnter: revealOnEnter,
      });

      return () => trigger.kill();
    },
    {
      scope: rootRef,
      dependencies: [watchKey, prefersReducedMotion],
      revertOnUpdate: true,
    },
  );
}
