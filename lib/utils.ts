// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine Tailwind class names conditionally, safely, and semantically.
 * Usage: cn("p-4", isActive && "bg-green-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
