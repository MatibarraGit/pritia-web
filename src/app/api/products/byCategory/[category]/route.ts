import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/libs/prisma";
import type { ProductResponseType } from "@/types";
import { PRODUCTS_PER_PAGE, formatProducts, toSlug } from "@/utils";

const templateSelectProductData = readFileSync(join(process.cwd(), 'prisma', 'queries', 'templateSelectProductData.sql'), 'utf8');
const BASE_QUERY = Prisma.sql([templateSelectProductData]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') ?? '1');
    const offset = (page - 1) * PRODUCTS_PER_PAGE;

    // Construir la consulta SQL usando la plantilla y agregando condiciones adicionales
    const productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
      ${BASE_QUERY}
      AND c.category_slug = ${category}
      ORDER BY COALESCE(updated_at, created_at) DESC,
      LIMIT ${PRODUCTS_PER_PAGE} 
      OFFSET ${offset}
    `);

    if (!productsRaw || productsRaw.length === 0) {
      return NextResponse.json({ products: [], total: 0 });
    }

    const totalResult = await prisma.$queryRaw<[{ count: number }]>`
      SELECT COUNT(*)::INTEGER
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.in_stock = TRUE 
        AND p.sell_price > 0 
        AND c.category_slug = ${toSlug(category)}
    `;

    const total = totalResult[0]?.count ?? 0;

    const products = formatProducts(productsRaw);
    return NextResponse.json({ products, total });
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener productos por categoría' },
      { status: 500 }
    );
  }
}