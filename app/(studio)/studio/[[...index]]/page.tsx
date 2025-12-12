"use client";

import dynamic from "next/dynamic";
import config from "@/sanity.config";
import { Spinner } from "@/components/ui/spinner";

// Disable SSR cho Studio để tránh hydration error
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner className="size-10" />
      </div>
    ),
  }
);

export default function StudioPage() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <NextStudio config={config} />
    </div>
  );
}

