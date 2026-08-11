import type { MetadataRoute } from "next";

import { siteUrl } from "./layout";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Placeholder projects and the request endpoint are not for crawlers.
      disallow: ["/work/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
