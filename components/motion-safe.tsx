// components/motion-safe.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useInView,
  type Variants,
  type Transition,
  type MarginType, // 👈 for useInView margin
} from "framer-motion";

/* ============================== Shared helpers ============================== */

const easing: Transition["ease"] = [0.22, 1, 0.36, 1];

function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Consistent motion presets across the site */
export function useMotionPresets() {
  const reduce = useReducedMotion();
  const base: Transition = reduce ? { duration: 0 } : { duration: 0.6, ease: easing };

  const fade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: base },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: base },
  };

  const stagger: Variants = {
    hidden: {},
    visible: reduce ? {} : { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };

  return { fade, fadeUp, stagger, base, reduce };
}

/* ============================ Hydration-safe Reveal ============================ */
/**
 * - SSR: renders visible (no opacity:0), so no “blank” on first paint.
 * - Client: animates when in view (IntersectionObserver).
 * - Fallback: if observer doesn’t fire within 500ms, force-show to avoid blanks.
 * - Reduced motion: renders static (no animation).
 *
 * IMPORTANT: Hooks are always called in the same order to satisfy the Rules of Hooks.
 */
export function Reveal({
  children,
  variants,
  as: Tag = "div",
  viewportAmount = 0.2,
  rootMargin = "0px 0px -80px 0px",
  className = "",
}: {
  children: ReactNode;
  variants: Variants;
  as?: React.ElementType;
  viewportAmount?: number;
  rootMargin?: MarginType; // 👈 typed for framer-motion
  className?: string;
}) {
  const mounted = useHasMounted();
  const { reduce } = useMotionPresets();

  // Always call hooks in the same order:
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: viewportAmount, margin: rootMargin, once: true });
  const [forceShow, setForceShow] = useState(false);

  // Only arm fallback when we actually intend to animate
  useEffect(() => {
    if (!mounted || reduce || inView) return;
    const t = setTimeout(() => setForceShow(true), 500);
    return () => clearTimeout(t);
  }, [mounted, reduce, inView]);

  const staticRender = !mounted || reduce;
  const visibleNow = staticRender ? true : (inView || forceShow);

  if (staticRender) {
    // Render Tag directly (keeps semantics; no any-cast)
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={visibleNow ? "visible" : "hidden"}
        variants={variants}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

/* ============================ Stagger group wrapper ============================ */
/**
 * Groups children under a staggered parent timeline.
 * Same SSR/PRM safety + 500ms force-show fallback as Reveal.
 */
export function StaggerGroup({
  children,
  className = "",
  viewportAmount = 0.2,
  rootMargin = "0px 0px -80px 0px",
}: {
  children: ReactNode;
  className?: string;
  viewportAmount?: number;
  rootMargin?: MarginType; // 👈 typed for framer-motion
}) {
  const mounted = useHasMounted();
  const { stagger, reduce } = useMotionPresets();

  // Always run hooks in the same sequence:
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: viewportAmount, margin: rootMargin, once: true });
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    if (!mounted || reduce || inView) return;
    const t = setTimeout(() => setForceShow(true), 500);
    return () => clearTimeout(t);
  }, [mounted, reduce, inView]);

  const staticRender = !mounted || reduce;
  const visibleNow = staticRender ? true : (inView || forceShow);

  if (staticRender) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={visibleNow ? "visible" : "hidden"}
        variants={stagger}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

/* ================================ Panel wrapper ================================ */
/**
 * Your old MotionPanel, rewritten with Reveal under the hood.
 * Keeps your site-wide card style consistent and safe.
 */
export function RevealPanel({
  children,
  className = "",
  viewportAmount = 0.18,
  rootMargin = "0px 0px -80px 0px",
}: {
  children: ReactNode;
  className?: string;
  viewportAmount?: number;
  rootMargin?: MarginType; // 👈 typed for framer-motion
}) {
  const { fadeUp } = useMotionPresets();
  return (
    <Reveal variants={fadeUp} viewportAmount={viewportAmount} rootMargin={rootMargin} className={className}>
      <section
        className={[
          "max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12",
          "bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg",
          "backdrop-blur-[1px]",
        ].join(" ")}
      >
        {children}
      </section>
    </Reveal>
  );
}
