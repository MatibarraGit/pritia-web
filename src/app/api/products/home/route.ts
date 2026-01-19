import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/libs/prisma";
import type { ProductResponseType } from "@/types";
import { formatProducts } from "@/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const templateSelectProductData = readFileSync(join(process.cwd(), 'prisma', 'queries', 'templateSelectProductData.sql'), 'utf8');
const BASE_QUERY = Prisma.sql([templateSelectProductData]);

const selectBestSellersProducts = readFileSync(join(process.cwd(), 'prisma', 'queries', 'selectBestSellersProducts.sql'), 'utf8');
const BEST_SELLERS_QUERY = Prisma.sql([selectBestSellersProducts]);

export async function GET() {
  try {
    // Nuevos ingresos
    const newEntriesProductsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
      ${BASE_QUERY}
      ORDER BY p.created_at DESC, p.product_id DESC
      LIMIT 30
    `);

    // Ofertas
    const productsOnOfferRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
      ${BASE_QUERY}
      AND p.discount_percent > 0
      ORDER BY p.discount_percent DESC, p.product_id DESC
      LIMIT 30
    `);

    // TODO: Integrar más vendidos
    // Más vendidos
    // const bestSellersProductsRaw = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
    //   ${BEST_SELLERS_QUERY}
    //   LIMIT 30
    // `);

    const newsProductsRaws = await prisma.$queryRaw<Array<ProductResponseType>>(Prisma.sql`
      ${BASE_QUERY}
      ORDER BY RANDOM()
      LIMIT 30
    `);

    const newEntriesProducts = formatProducts(newEntriesProductsRaw);
    const productsOnOffer = formatProducts(productsOnOfferRaw);
    // const bestSellersProducts = formatProducts(bestSellersProductsRaw);
    const newsProducts = formatProducts(newsProductsRaws);

    return NextResponse.json(
      {
        newEntriesProducts,
        productsOnOffer,
        // bestSellersProducts,
        newsProducts
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor al obtener productos para la página de inicio" },
      { status: 500 }
    );
  }
}
