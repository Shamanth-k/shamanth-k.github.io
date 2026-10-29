import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://shamanth-k.github.io/",
      lastModified: new Date("2026-10-29T00:00:00.000Z"),
    },
  ];
}
