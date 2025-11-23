import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/libs/prisma";
import type { ProductResponseType } from "@/types";
import { PRODUCTS_PER_PAGE, formatProducts } from "@/utils";

const templateSelectProductData = readFileSync(join(process.cwd(), 'prisma', 'queries', 'templateSelectProductData.sql'), 'utf8');
const BASE_QUERY = Prisma.sql([templateSelectProductData]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('searchTerm') ?? "";
    const page = parseInt(searchParams.get('page') ?? '1');
    const offset = (page - 1) * PRODUCTS_PER_PAGE;

    const pattern = `%${search}%`;

    const productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
      ${BASE_QUERY}
      AND (p.product_name ILIKE ${pattern} OR
      p.product_id::TEXT LIKE ${pattern})
      ORDER BY 
        CASE
        WHEN p.product_id::TEXT LIKE ${search} THEN 1
          WHEN p.product_id::TEXT LIKE '%' || ${search} THEN 2
          WHEN p.product_id::TEXT LIKE ${pattern} THEN 3
          WHEN p.product_name ILIKE ${pattern} THEN 4
          ELSE 5
        END
      LIMIT ${PRODUCTS_PER_PAGE} 
      OFFSET ${offset}
    `);

    const products = formatProducts(productsRaw);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener productos disponibles' },
      { status: 500 }
    );
  }
}



