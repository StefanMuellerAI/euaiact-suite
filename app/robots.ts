import type { MetadataRoute } from "next";

/** Interne Arbeitshilfe – nicht für Suchmaschinen bestimmt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
