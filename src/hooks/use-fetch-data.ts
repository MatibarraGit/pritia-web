/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from "react"
// import { getProductsBySearch } from "@/services"

export function useFetchData<T>({ fetchFunction }: { fetchFunction: () => Promise<T | null> }) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    setIsLoading(true);
    try {
      const initialData = await fetchFunction();
      setData(initialData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { data, setData, isLoading, fetchData };
}

// export const useFetchProductsBySearch = (search: string) => {
//   const [products, setProducts] = useState<ProductType[] | null>([])
//   const [type, setType] = useState('')
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setIsLoading(true)
//       try {
//         const initialProducts = await getProductsBySearch(search);
//         if(initialProducts === null) return
//         setProducts(initialProducts.products)
//         setType(initialProducts.type)
//       } catch {
//         return null
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchProducts()
//   }, [search])

//   return { products, type, setProducts, isLoading }
// }