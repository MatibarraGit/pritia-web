import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/libs/prisma";
import type { ProductResponseType } from "@/types";
import { PRODUCTS_PER_PAGE, formatProducts } from "@/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1");
    const offset = (page - 1) * PRODUCTS_PER_PAGE;
    const pattern = `%${search}%`;

    const productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
      SELECT 
        p.*, 
        COALESCE(array_agg(pr.provider_name ORDER BY pr.provider_name) FILTER (WHERE pr.provider_name IS NOT NULL), ARRAY[]::text[]) AS provider_names,
        c.category_name, 
        sc.subcategory_name
      FROM products p
      LEFT JOIN providers pr ON pr.provider_id = ANY(p.provider_ids)
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN subcategories sc on sc.subcategory_id = p.subcategory_id
      WHERE p.discount_percent != 0
        AND (
          unaccent(p.product_name) ILIKE unaccent(${pattern})
          OR WORD_SIMILARITY(unaccent(p.product_name), unaccent(${search})) > 0.45
          OR p.product_id::TEXT LIKE ${pattern}
        )
      GROUP BY p.product_id, c.category_name, sc.subcategory_name
      ORDER BY 
        COALESCE(p.updated_at, p.created_at) DESC,
        p.product_id ASC
      LIMIT ${PRODUCTS_PER_PAGE} 
      OFFSET ${offset}
    `);

    const total = await prisma.$queryRaw<[{ count: number }]>(Prisma.sql`
      SELECT COUNT(*)::INTEGER
      FROM products p
      WHERE p.discount_percent != 0
        AND (
          unaccent(p.product_name) ILIKE unaccent(${pattern})
          OR WORD_SIMILARITY(unaccent(p.product_name), unaccent(${search})) > 0.45
          OR p.product_id::TEXT LIKE ${pattern}
        )
    `);

    return NextResponse.json({
      products: formatProducts(productsRaw),
      total: total[0]?.count ?? 0,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error interno del servidor al obtener productos en oferta" },
      { status: 500 }
    );
  }
}
