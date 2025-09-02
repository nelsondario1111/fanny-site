"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ClientFade({
  children,
  delay = 0,
  y = 10,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
