"use client";

import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.24,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]"
    >
      <m.div
        className="h-full origin-left bg-gradient-to-r from-brand-green via-brand-blue to-brand-gold shadow-[0_0_12px_rgba(47,74,53,0.28)]"
        style={{ scaleX: reduce ? scrollYProgress : smoothProgress }}
      />
    </div>
  );
}
