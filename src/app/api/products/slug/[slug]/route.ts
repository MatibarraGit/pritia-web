import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { formatProduct } from "@/utils";
import type { ProductType } from "@/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const product = await prisma.products.findFirst({
      where: {
        product_slug: slug,
        deleted_at: null,
      },
      include: {
        categories: {
          select: {
            category_name: true,
          },
        },
        subcategories: {
          select: {
            subcategory_name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json([]);
    }

    // Formatear el producto al formato estándar
    const formattedProduct: ProductType = formatProduct({
      product_id: product.product_id,
      product_name: product.product_name,
      purchase_price: product.purchase_price,
      sell_price: product.sell_price ?? 0,
      discount_percent: product.discount_percent ?? 0,
      category_name: product.categories?.category_name || '',
      subcategory_name: product.subcategories?.subcategory_name || '',
      in_stock: product.in_stock,
      stock: product.stock ?? 0,
      product_description: product.product_description || '',
      product_slug: product.product_slug || '',
      images: product.images,
      created_at: product.created_at,
      updated_at: product.updated_at,
    });

    return NextResponse.json([formattedProduct], {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener producto' },
      { status: 500 }
    );
  }
}

