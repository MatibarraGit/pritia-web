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
      return NextResponse.json([]);
    }

    const products = formatProducts(productsRaw);
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener productos por subcategoría' },
      { status: 500 }
    );
  }
}







