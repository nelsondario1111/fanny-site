import type { Metadata } from "next";
import ClientLibraryStarter from "@/components/ClientLibraryStarter";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Client Library",
  description:
    "Client Library for checklists, timelines, secure document guidance, and intake links for Toronto and Ontario clients.",
  path: "/en/client-library",
  locale: "en",
});

export default function ClientLibraryPage() {
  return <ClientLibraryStarter lang="en" />;
}
