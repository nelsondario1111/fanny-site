"use client";

import type { ReactNode } from "react";
import { Reveal, useMotionPresets } from "@/components/motion-safe";

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  viewportAmount?: number;
};

export default function RevealSection({
  children,
  className = "",
  viewportAmount = 0.16,
}: RevealSectionProps) {
  const { fadeUp } = useMotionPresets();

  return (
    <Reveal variants={fadeUp} className={className} viewportAmount={viewportAmount}>
      {children}
    </Reveal>
  );
}
