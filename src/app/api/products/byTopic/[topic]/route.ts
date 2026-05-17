import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/libs/prisma";
import { ProductResponseType } from "@/types";
import { PRODUCTS_PER_PAGE, TOPICS, formatProduct } from "@/utils";

const templateSelectProductData = readFileSync(join(process.cwd(), 'prisma', 'queries', 'templateSelectProductData.sql'), 'utf8');
// const selectBestSellersProducts = readFileSync(join(process.cwd(), 'prisma', 'queries', 'selectBestSellersProducts.sql'), 'utf8');

const BASE_QUERY = Prisma.sql([templateSelectProductData]);
// const BEST_SELLERS_QUERY = Prisma.sql([selectBestSellersProducts]);

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
    let total = 0;

    switch (topic) {
      case TOPICS.NEW_ENTRIES:
        productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
          ${BASE_QUERY}
          ORDER BY p.created_at DESC, p.product_id DESC
          LIMIT ${PRODUCTS_PER_PAGE} 
          OFFSET ${offset}
        `)
        total = PRODUCTS_PER_PAGE * 4;
        break;

      case TOPICS.OFFERS:
        productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
          ${BASE_QUERY}
          AND p.discount_percent > 0
          ORDER BY p.stock DESC, p.discount_percent DESC, p.product_id ASC
          LIMIT ${PRODUCTS_PER_PAGE} 
          OFFSET ${offset}
        `)
        const offersTotalResult = await prisma.$queryRaw<[{ count: number }]>`
          SELECT COUNT(*)::INTEGER
          FROM products p
          WHERE p.in_stock = TRUE 
            AND p.sell_price > 0
            AND p.discount_percent > 0
        `;
        total = offersTotalResult[0]?.count ?? 0;
        break;

      // case TOPICS.BEST_SELLERS:
      //   // Obtener productos ordenado por ventas 
      //   productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
      //     ${BEST_SELLERS_QUERY}
      //     LIMIT ${PRODUCTS_PER_PAGE} 
      //     OFFSET ${offset}
      //   `)
      //   // TODO: Eliminar cuando hayan más de 240
      //   const bestSellersTotalResult = await prisma.$queryRaw<[{ count: number }]>`
      //     SELECT COUNT(*)::INTEGER FROM (
      //       SELECT p.product_id
      //       FROM purchase_order_items poi
      //       JOIN products p ON poi.product_id = p.product_id
      //       LEFT JOIN purchase_orders po ON poi.order_id = po.order_id
      //       WHERE p.in_stock = TRUE AND po.order_status = 'Vendida'
      //       GROUP BY p.product_id
      //     ) AS best_sellers_count
      //   `;
      //   total = bestSellersTotalResult[0]?.count ?? 0;
      //   break;

      case TOPICS.RE_ENTRIES:
        productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
          ${BASE_QUERY}
          AND p.updated_at IS NOT NULL
          ORDER BY p.updated_at DESC
          LIMIT ${PRODUCTS_PER_PAGE} 
          OFFSET ${offset}
        `)
        total = PRODUCTS_PER_PAGE * 4;
        break;

      case TOPICS.NEWS:
        productsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
          ${BASE_QUERY}
          ORDER BY RANDOM()
          LIMIT ${PRODUCTS_PER_PAGE} 
          OFFSET ${offset}
        `)
        total = PRODUCTS_PER_PAGE * 4;
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
    return NextResponse.json({ products, total });
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener productos por tópico' },
      { status: 500 }
    );
  }
}