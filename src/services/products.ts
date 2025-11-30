import type { ProductType, ActionResponse } from "@/types";
import { apiRequest } from "./api-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// GET - Obtener todos los productos
interface GetAllProductsParams {
  page?: number;
  search?: string;
}

interface GetAllProductsResponse {
  products: ProductType[];
  totalProducts: number;
}

// GET - Obtener productos para la página de inicio
export interface HomeProductsResponse {
  bestSellersProducts: ProductType[];
  productsOnOffer: ProductType[];
  newEntriesProducts: ProductType[];
}

// GET - Obtener todos los productos
export async function getAllProducts({ page = 1, search = "" }: GetAllProductsParams = {}): Promise<GetAllProductsResponse> {
  try {
    const params = new URLSearchParams();
    if (page) params.set('page', page.toString());
    if (search) params.set('search', search);

    const response = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
      cache: 'no-store'
    });

    const products: ProductType[] = await response.json();

    // Obtener el total de productos
    const countParams = new URLSearchParams();
    if (search) countParams.set('param[search]', search);

    const countResponse = await fetch(`${baseUrl}/api/products/count?${countParams.toString()}`, {
      cache: 'no-store'
    });

    let totalProducts = 0;
    if (countResponse.ok) {
      const countData = await countResponse.json();
      totalProducts = countData[0]?.total || 0;
    }

    return { products, totalProducts };
  } catch {
    return { products: [], totalProducts: 0 }
  }
}

// GET - Obtener producto por ID
export async function getProductById(id: number): Promise<ProductType | null> {
  try {
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const product: ProductType = await response.json();
    return product;
  } catch {
    return null
  }
}

// GET - Obtener productos para la página de inicio
export async function getHomeProducts(): Promise<HomeProductsResponse> {
  try {
    const response = await fetch(`${baseUrl}/api/products/home`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        bestSellersProducts: [],
        productsOnOffer: [],
        newEntriesProducts: []
      };
    }

    const data: HomeProductsResponse = await response.json();
    return data;
  } catch {
    return {
      bestSellersProducts: [],
      productsOnOffer: [],
      newEntriesProducts: []
    };
  }
}

// POST - Crear producto
export async function createProduct(formData: FormData): Promise<ActionResponse & { slug?: string }> {
  return apiRequest<{ slug?: string }>({
    endpoint: '/api/products',
    method: 'POST',
    body: formData,
    successMessage: "¡Listo, creaste el producto!, ¿Qué sigue?",
    errorMessage: 'Error al crear el producto',
    transformResponse: (data) => ({ slug: (data as { slug?: string })?.slug }),
  });
}

// PUT - Actualizar producto
export async function updateProduct(id: number, formData: FormData): Promise<ActionResponse & { slug?: string }> {
  return apiRequest<{ slug?: string }>({
    endpoint: `/api/products/${id}`,
    method: 'PUT',
    body: formData,
    successMessage: "¡Listo, modificaste el producto!, ¿Qué sigue?",
    errorMessage: 'Error al actualizar el producto',
    transformResponse: (data) => ({ slug: (data as { slug?: string })?.slug }),
  });
}

// PATCH - Deshabilitar producto
export async function disableProduct(id: number): Promise<ActionResponse> {
  return apiRequest({
    endpoint: `/api/products/${id}`,
    method: 'PATCH',
    successMessage: "Producto deshabilitado",
    errorMessage: 'Error al deshabilitar el producto',
  });
}

// DELETE - Eliminar producto
export async function deleteProduct(id: number): Promise<ActionResponse> {
  return apiRequest({
    endpoint: `/api/products/${id}`,
    method: 'DELETE',
    successMessage: "Producto Eliminado",
    errorMessage: 'Error al eliminar el producto',
  });
}