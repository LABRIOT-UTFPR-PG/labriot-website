import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/lib/site-url";

const publicRoutes = [
  "/",
  "/contact",
  "/projects/roboflow",
  "/team",
  "/events",
  "/blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((pathname) => ({
    url: absoluteSiteUrl(pathname),
    lastModified,
    changeFrequency: pathname === "/" ? "weekly" : "monthly",
    priority: pathname === "/" ? 1 : 0.7,
  }));
}
