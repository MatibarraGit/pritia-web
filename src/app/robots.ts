// TODO: Adaptar la url base para mi proyecto
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mddirecto.com';
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}