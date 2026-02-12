"use client";

import { m, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

export default function HeroScrollAccents({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const yTopRaw = useTransform(scrollY, [0, 1200], [0, 120]);
  const yBottomRaw = useTransform(scrollY, [0, 1200], [0, -90]);
  const xRightRaw = useTransform(scrollY, [0, 1200], [0, 60]);

  const yTop = useSpring(yTopRaw, { stiffness: 120, damping: 26, mass: 0.28 });
  const yBottom = useSpring(yBottomRaw, { stiffness: 120, damping: 26, mass: 0.28 });
  const xRight = useSpring(xRightRaw, { stiffness: 120, damping: 26, mass: 0.28 });

  const topStyle = reduce ? undefined : { y: yTop };
  const bottomStyle = reduce ? undefined : { y: yBottom };
  const rightStyle = reduce ? undefined : { x: xRight, y: yBottom };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
    >
      <m.div
        className="absolute -left-20 -top-16 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl"
        style={topStyle}
      />
      <m.div
        className="absolute -bottom-20 left-[22%] h-80 w-80 rounded-full bg-brand-blue/15 blur-3xl"
        style={bottomStyle}
      />
      <m.div
        className="absolute -right-24 top-[18%] h-64 w-64 rounded-full bg-brand-green/20 blur-3xl"
        style={rightStyle}
      />
    </div>
  );
}
