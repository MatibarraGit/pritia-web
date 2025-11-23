import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/libs/prisma";
import type { ProductResponseType } from "@/types";
import { formatProducts } from "@/utils";

const templateSelectProductData = readFileSync(join(process.cwd(), 'prisma', 'queries', 'templateSelectProductData.sql'), 'utf8');
const BASE_QUERY = Prisma.sql([templateSelectProductData]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchEncode = searchParams.get('search');
  const search = searchEncode ? decodeURIComponent(searchEncode) : '';

  if (!search || search.trim() === '') {
    return NextResponse.json(
      { message: 'No se ha proporcionado un término de búsqueda' },
      { status: 400 }
    );
  }

  const pattern = `%${search}%`;

  try {
    // Obtener subcategorías que coinciden si la longitud del término de búsqueda es mayor o igual a 4
    const subcategories = await prisma.$queryRaw<Array<{ subcategory_id: number }>>`
      SELECT DISTINCT p.subcategory_id
      FROM products p
      JOIN subcategories sc ON p.subcategory_id = sc.subcategory_id
      WHERE 
        p.sell_price > 0 AND 
        p.in_stock = TRUE AND 
        (length(unaccent(${search})) >= 4 AND unaccent(sc.subcategory_name) ILIKE unaccent(${pattern}))
    `
    const subcategoriesId = subcategories.map(sc => sc.subcategory_id);

    // Obtener productos
    const productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
      ${BASE_QUERY}
      AND (
        unaccent(p.product_name) ILIKE unaccent(${pattern})
        OR p.subcategory_id = ANY(${subcategoriesId})
        OR WORD_SIMILARITY(unaccent(p.product_name), unaccent(${search})) > 0.45
      )
      ORDER BY 
        CASE 
          -- Busca una coincidencia de palabra completa dentro del texto (ej: "Cama" o "Cama de...")
          WHEN unaccent(p.product_name) ~* ('\\m' || unaccent(${search}) || '\\M') THEN 1
          -- El product_name entero es igual al search
          WHEN unaccent(p.product_name) ILIKE unaccent(${search}) THEN 2 
          -- Subcategoría coincide (solo aplica si la longitud del término de búsqueda es mayor o igual a 4)
          WHEN unaccent(sc.subcategory_name) ILIKE unaccent(${pattern}) THEN 3
          -- Contiene el término buscado en cualquier parte del product_name
          WHEN unaccent(p.product_name) ILIKE unaccent(${pattern}) THEN 4
          ELSE 5
        END,
        WORD_SIMILARITY(unaccent(p.product_name), unaccent(${search})) DESC
    `);

    // Si no hay productos, devolver productos aleatorios
    if (productsRaw.length === 0) {
      const fallbackProductsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
        ${BASE_QUERY}
        ORDER BY RANDOM()
        LIMIT 12
      `);

      const fallbackProducts = formatProducts(fallbackProductsRaw);
      return NextResponse.json({
        type: 'tooInteresting',
        products: fallbackProducts,
      });
    }

    const products = formatProducts(productsRaw);
    return NextResponse.json({
      type: 'exact',
      products: products,
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al buscar productos' },
      { status: 500 }
    );
  }
}