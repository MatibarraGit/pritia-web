import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchEncode = searchParams.get('search');
  const search = searchEncode ? decodeURIComponent(searchEncode) : '';

  if (!search || search.trim() === '') {
    return NextResponse.json(
      { message: 'No se ha proporcionado un término de búsqueda' },
      { status: 400 }
    );
  }

  try {
    const products = await prisma.products.findMany({
      where: {
        product_name: {
          contains: search,
          mode: 'insensitive',
        },
        deleted_at: null,
      },
      select: {
        product_name: true,
      },
      orderBy: {
        product_name: 'desc',
      },
      take: 6,
    });

    if (products.length === 0) {
      return NextResponse.json([]);
    }

    const productsName = products.map((product) => product.product_name);

    return NextResponse.json(productsName);
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener productos para el buscador' },
      { status: 500 }
    );
  }
}



