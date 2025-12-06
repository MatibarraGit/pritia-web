import { getAllProducts } from "@/services"

export const revalidate = 30

export default async function sitemap() {
  const { products } = await getAllProducts()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mddirecto.com'

  const productsSitemapData = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8
  }))

  const searchResultsSitemapData = products.map((product) => ({
    url: `${baseUrl}/search-results/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5
  }))
  
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/loved-products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3
    },
    
    ...productsSitemapData,
    ...searchResultsSitemapData

  ]
}