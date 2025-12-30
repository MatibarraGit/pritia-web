import { apiRequest } from "./api-client";
import type { ProductType, ActionResponse, SelectedItemsType } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Tipado de respuesta de la API
export interface GetAllProductsParams {
  page?: number;
  search?: string;
}

export interface GetAllProductsResponse {
  products: ProductType[];
  total: number;
}

export interface HomeProductsResponse {
  bestSellersProducts: ProductType[];
  productsOnOffer: ProductType[];
  newEntriesProducts: ProductType[];
}

export interface GetProductsByCategoryParams {
  category: string;
  page?: number;
}

export interface GetProductsBySubcategoryParams {
  subcategory: string;
  page?: number;
}

export interface GetProductsByTopicParams {
  topic: string;
  page?: number;
}

export interface SearchProductsParams {
  search: string;
}

export interface SearchProductsResponse {
  products: ProductType[];
  total: number;
  type: 'exact' | 'tooInteresting';
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
    const json: { products: ProductType[], total: number } = await response.json();

    return { products: json.products, total: json.total };
  } catch {
    return { products: [], total: 0 }
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

// GET - Obtener productos disponibles
export async function getAvailableProducts({ page = 1, search = "" }: GetAllProductsParams = {}): Promise<GetAllProductsResponse> {
  try {
    const params = new URLSearchParams();
    if (page) params.set('page', page.toString());
    if (search) params.set('searchTerm', search);

    const response = await fetch(`${baseUrl}/api/products/available?${params.toString()}`, {
      cache: 'no-store'
    });
    const json: { products: ProductType[], total: number } = await response.json();

    return { products: json.products, total: json.total };
  } catch {
    return { products: [], total: 0 }
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

// GET - Obtener productos por categoría
export async function getProductsByCategory({ category, page = 1 }: GetProductsByCategoryParams): Promise<GetAllProductsResponse> {
  try {
    const params = new URLSearchParams();
    if (page) params.set('page', page.toString());

    const response = await fetch(`${baseUrl}/api/products/byCategory/${encodeURIComponent(category)}?${params.toString()}`, {
      cache: 'no-store'
    });
    const json: { products: ProductType[], total: number } = await response.json();

    return { products: json.products || [], total: json.total ?? json.products?.length ?? 0 };
  } catch {
    return { products: [], total: 0 };
  }
}

// GET - Obtener productos por subcategoría
export async function getProductsBySubcategory({ subcategory, page }: GetProductsBySubcategoryParams): Promise<GetAllProductsResponse> {
  try {
    const params = new URLSearchParams();
    if (page) params.set('page', page.toString());

    const response = await fetch(`${baseUrl}/api/products/bySubcategory/${encodeURIComponent(subcategory)}?${params.toString()}`, 
      { cache: 'no-store' }
    );
    const json: { products: ProductType[], total: number } = await response.json();

    return { products: json.products || [], total: json.total };
  } catch {
    return { products: [], total: 0 };
  }
}

// GET - Obtener productos por tópico
export async function getProductsByTopic({ topic, page = 1 }: GetProductsByTopicParams): Promise<GetAllProductsResponse> {
  try {
    const params = new URLSearchParams();
    if (page) params.set('page', page.toString());

    const response = await fetch(`${baseUrl}/api/products/byTopic/${encodeURIComponent(topic)}?${params.toString()}`, {
      cache: 'no-store'
    });
    const json: { products: ProductType[], total: number } = await response.json();

    return { products: json.products || [], total: json.total ?? json.products?.length ?? 0 };
  } catch {
    return { products: [], total: 0 };
  }
}

// GET - Buscar productos
export async function searchProducts({ search }: SearchProductsParams): Promise<SearchProductsResponse> {
  try {
    const params = new URLSearchParams();
    params.set('search', search);

    const response = await fetch(`${baseUrl}/api/products/search?${params.toString()}`, {
      cache: 'no-store'
    });
    const json: SearchProductsResponse = await response.json();

    return {
      products: json.products || [],
      total: json.total,
      type: json.type,
    };
  } catch {
    return { products: [], total: 0, type: 'exact' };
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

// POST - Compartir producto
export async function shareProducts(products: SelectedItemsType[], to: number): Promise<ActionResponse> {
  let errorMessage: string = "";
  async function postToWebhook(product: SelectedItemsType) {
    try {
      const response = await fetch(
        `https://n8n-personal-n8n.b1o0vq.easypanel.host/webhook/share-products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product, to }),
        }
      );
      const json = await response.json()
  
      if (!json.ok) {
        return errorMessage += `${product.name}. `;
      }
    } catch (error) {
      console.error(error);
      return errorMessage +=  `${product.name}. `;
    }
  }    

  // Función para pausar
  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  for (const product of products) {
    await postToWebhook(product);
    await delay(1000); // Espera 1 segundo (1000 ms)
  };

  if (errorMessage !== "") return { errorMessage: `Error al compartir los productos: ${errorMessage}` };
  return { successMessage: "Productos compartidos exitosamente" };
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