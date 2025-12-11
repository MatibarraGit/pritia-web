import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/libs/prisma";
import type { ProductResponseType } from "@/types";
import { formatProducts } from "@/utils";

const templateSelectProductData = readFileSync(join(process.cwd(), 'prisma', 'queries', 'templateSelectProductData.sql'), 'utf8');
const BASE_QUERY = Prisma.sql([templateSelectProductData]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subcategory: string }> }
) {
  try {
    const { subcategory } = await params;

    const productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
      ${BASE_QUERY}
      AND sc.subcategory_name = ${subcategory}
      ORDER BY p.product_name ASC, p.product_id ASC
    `);

    if (productsRaw.length === 0) {
      return NextResponse.json({ products: [], total: 0 });
    }

    const totalResult = await prisma.$queryRaw<[{ count: number }]>`
      SELECT COUNT(*)::INTEGER
      FROM products p
      LEFT JOIN subcategories sc ON sc.subcategory_id = p.subcategory_id
      WHERE p.in_stock = TRUE 
        AND (p.sell_price > 0 AND p.sell_price IS NOT NULL) 
        AND p.deleted_at IS NULL
        AND sc.subcategory_name = ${subcategory}
    `;

    const total = totalResult[0]?.count ?? 0;

    const products = formatProducts(productsRaw);
    return NextResponse.json(
      { products, total },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener productos por subcategoría' },
      { status: 500 }
    );
  }
}







