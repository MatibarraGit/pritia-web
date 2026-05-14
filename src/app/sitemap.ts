import { getAllProducts } from "@/services"

export const revalidate = 30

export default async function sitemap() {
  const { products } = await getAllProducts()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pritia.com.ar';

  const productsSitemapData = products.map((product) => ({
    url: `${baseUrl}/producto/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8
  }))

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: `${baseUrl}/productos-favoritos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3
    },
    
    ...productsSitemapData
  ]
}