import type { MetadataRoute } from "next";

const BLOCKED_BOT_USER_AGENTS = [
  "AhrefsBot",
  "AhrefsSiteAudit",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "BLEXBot",
  "DataForSeoBot",
  "PetalBot",
  "Bytespider",
  "CCBot",
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pritia.com.ar';

  return {
    rules: [
      ...BLOCKED_BOT_USER_AGENTS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/mi-cuenta/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
