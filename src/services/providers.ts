"use server";

import type { Provider } from "@/types";

export async function fetchAllProviders(): Promise<Provider[] | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/providers`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    const providersData: Provider[] = await response.json();
    return providersData;
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return null;
  }
}



