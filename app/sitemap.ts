import type { MetadataRoute } from "next";

import { siteUrl } from "./layout";
import { WORK } from "@/lib/content";

/**
 * The four capability pieces are listed. They were absent while they were
 * reserved slots carrying no content; they are now full pages that say
 * something a reader might search for.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/work",
    ...WORK.map((item) => `/work/${item.slug}`),
    "/services",
    "/process",
    "/studio",
    "/studio/principles",
    "/clients",
    "/contact",
  ];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : 0.7,
  }));
}
