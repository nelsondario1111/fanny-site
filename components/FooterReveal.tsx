// components/FooterReveal.tsx
"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Footer from "./Footer";

type FooterRevealProps = { lang: "en" | "es" };

export default function FooterReveal({ lang }: FooterRevealProps) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const t = prefersReduced ? { duration: 0 } : { duration: 0.35, ease };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: t }}
        exit={{ opacity: 0, y: 4, transition: t }}
      >
        <Footer lang={lang} />
      </motion.div>
    </AnimatePresence>
  );
}
