import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      select: {
        product_slug: true,
      },
    });

    if (products.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: `Error al obtener slugs: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}







