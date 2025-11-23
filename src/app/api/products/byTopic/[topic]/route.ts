import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/libs/prisma";
import { ProductResponseType } from "@/types";
import { PRODUCTS_PER_PAGE, TOPICS, formatProduct } from "@/utils";


const templateSelectProductData = readFileSync(join(process.cwd(), 'prisma', 'queries', 'templateSelectProductData.sql'), 'utf8');
const selectBestSellersProducts = readFileSync(join(process.cwd(), 'prisma', 'queries', 'selectBestSellersProducts.sql'), 'utf8');

const BASE_QUERY = Prisma.sql([templateSelectProductData]);
const BEST_SELLERS_QUERY = Prisma.sql([selectBestSellersProducts]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ topic: string }> }
) {
  try {
    const { topic } = await params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') ?? '1');
    const offset = (page - 1) * PRODUCTS_PER_PAGE;

    let productsRaw: ProductResponseType[];

    switch (topic) {
      case TOPICS.NEW_ENTRIES:
        productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
          ${BASE_QUERY}
          ORDER BY p.created_at DESC, p.product_id
          LIMIT ${PRODUCTS_PER_PAGE} 
          OFFSET ${offset}
        `)
        break;

      case TOPICS.OFFERS:
        productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
          ${BASE_QUERY}
          AND p.discount_percent > 0
          ORDER BY p.discount_percent DESC, p.product_id ASC
          LIMIT ${PRODUCTS_PER_PAGE} 
          OFFSET ${offset}
        `)
        break;

      case TOPICS.BEST_SELLERS:
        // Obtener productos con sus ventas
        productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
          ${BEST_SELLERS_QUERY}
          LIMIT ${PRODUCTS_PER_PAGE} 
          OFFSET ${offset}
        `)
        break;

      default:
        return NextResponse.json(
          { message: 'Invalid Topic' },
          { status: 400 }
        );
    }

    const products = productsRaw.map((product: ProductResponseType) => {
      return { 
        ...formatProduct(product),
        totalQuantitySold: product.total_quantity_sold,
      };
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener productos por tópico' },
      { status: 500 }
    );
  }
}