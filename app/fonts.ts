// app/fonts.ts
import { DM_Sans, Fraunces } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--font-fraunces",
  display: "swap",
});
