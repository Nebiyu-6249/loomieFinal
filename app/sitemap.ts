import type { MetadataRoute } from "next";

import { siteUrl } from "./layout";

/**
 * The reserved work slots are deliberately absent: they carry
 * `robots: { index: false }` because they are not projects, and listing them
 * here would contradict that.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/services", "/studio", "/clients", "/contact"];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : 0.7,
  }));
}
