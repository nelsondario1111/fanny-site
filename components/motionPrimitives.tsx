// components/motionPrimitives.tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import useMounted from "@/lib/useMounted";

/* Easing + variants (unchanged) */
const easing: number[] = [0.22, 1, 0.36, 1];

export function useAnims() {
  const prefersReduced = useReducedMotion();

  const fade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.6, ease: easing },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.6, ease: easing },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: prefersReduced ? {} : { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  return { fade, fadeUp, stagger };
}

/* Mount-safe wrappers you can import and use */
export function MountSafeInView({
  variants,
  className,
  viewportAmount = 0.22,
  children,
}: {
  variants: any;
  className?: string;
  viewportAmount?: number;
  children: React.ReactNode;
}) {
  const mounted = useMounted();
  const initialProp = mounted ? "hidden" : false;

  return (
    <motion.section
      variants={variants}
      initial={initialProp}
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function MountSafeAboveTheFold({
  variants,
  className,
  children,
}: {
  variants: any;
  className?: string;
  children: React.ReactNode;
}) {
  // Never render hidden on the server for above-the-fold
  return (
    <motion.div variants={variants} initial={false} animate="visible" className={className}>
      {children}
    </motion.div>
  );
}
