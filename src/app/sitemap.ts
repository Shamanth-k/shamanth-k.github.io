import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://shamanth-k.github.io",
      lastModified: new Date(),
    },
  ];
}
