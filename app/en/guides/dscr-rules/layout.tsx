import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "DSCR Rules Guide",
  description:
    "Understand DSCR mortgage qualification rules with practical examples and planning tips.",
  path: "/en/guides/dscr-rules",
  locale: "en",
});

export default function DscrRulesLayout({ children }: { children: ReactNode }) {
  return children;
}
