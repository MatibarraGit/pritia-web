import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/libs/prisma";
import type { ProductResponseType } from "@/types";
import { PRODUCTS_PER_PAGE, formatProducts } from "@/utils";

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
      AND c.category_name = ${category}
      ORDER BY p.product_name ASC, p.product_id ASC
      LIMIT ${PRODUCTS_PER_PAGE} 
      OFFSET ${offset}
    `);

    if (!productsRaw || productsRaw.length === 0) {
      return NextResponse.json([]);
    }

    const products = formatProducts(productsRaw);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener productos por categoría' },
      { status: 500 }
    );
  }
}