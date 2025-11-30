import type { ActionResponse } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

type HttpMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions<TResponse = Record<string, unknown>> {
  endpoint: string;
  method: HttpMethod;
  body?: FormData | Record<string, unknown> | null;
  successMessage?: string;
  errorMessage?: string;
  transformResponse?: (data: unknown) => TResponse;
}

/**
 * Función genérica para realizar peticiones HTTP a la API
 * @param options - Opciones de la petición
 * @returns Promise con ActionResponse y datos adicionales opcionales
 */
export async function apiRequest<TResponse = Record<string, unknown>>({
  endpoint,
  method,
  body = null,
  successMessage,
  errorMessage,
  transformResponse,
}: ApiRequestOptions<TResponse>): Promise<ActionResponse & TResponse> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {};
    
    // Solo agregar Content-Type si no es FormData
    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body instanceof FormData 
        ? body 
        : body 
          ? JSON.stringify(body) 
          : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        errorMessage: data.message || errorMessage || `Error al procesar la petición ${method}`,
      } as ActionResponse & TResponse;
    }

    const transformedData = transformResponse ? transformResponse(data) : (data as TResponse);

    return {
      successMessage: successMessage || 'Operación realizada con éxito',
      ...transformedData,
    } as ActionResponse & TResponse;
  } catch (error) {
    return {
      errorMessage: error instanceof Error ? error.message : 'Error desconocido',
    } as ActionResponse & TResponse;
  }
}

