'use client'

import { useEffect, useState } from "react"
import { ProductType } from "@/types"

export type SearchResultType = 'exact' | 'tooInteresting'

export interface SearchProductsResponse {
  products: ProductType[]
  type: SearchResultType
}

export const useFetchProductsBySearch = (search: string) => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [type, setType] = useState<SearchResultType>('exact')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!search || search.trim() === '') {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const encodedSearch = encodeURIComponent(search)
        const response = await fetch(`/api/products/search?search=${encodedSearch}`)
        
        if (!response.ok) {
          throw new Error('Error al obtener productos')
        }

        const data: SearchProductsResponse = await response.json()
        setProducts(data.products || [])
        setType(data.type || 'exact')
      } catch (error) {
        console.error('Error fetching products by search:', error)
        setProducts([])
        setType('exact')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [search])

  return { products, type, setProducts, isLoading }
}