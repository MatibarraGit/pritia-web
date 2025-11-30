import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { TOPICS } from "@/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('param[category]');
    const topic = searchParams.get('param[topic]');
    const search = searchParams.get('param[search]');

    let count = 0;

    if (category) {
      count = await prisma.products.count({
        where: {
          AND: [
            { deleted_at: null },
            { in_stock: true },
            { sell_price: { gt: 0 } },
            {
              categories: {
                category_name: category,
              },
            },
          ],
        },
      });
    } else if (topic === TOPICS.OFFERS) {
      count = await prisma.products.count({
        where: {
          AND: [
            { in_stock: true },
            { sell_price: { gt: 0 } },
            { discount_percent: { gt: 0 } },
          ],
        },
      });
    } else if (topic === TOPICS.BEST_SELLERS || topic === TOPICS.NEW_ENTRIES) {
      // TODO: Cambiar este total arbitrario
      return NextResponse.json([{ total: 200 }]);
    } else if (search) {
      const pattern = `%${search}%`;
      const response = await prisma.$queryRaw`
        SELECT COUNT(*)::INTEGER AS total
        FROM products p
        LEFT JOIN subcategories sc ON p.subcategory_id = sc.subcategory_id
        WHERE 
          p.sell_price > 0 AND 
          p.in_stock = TRUE AND
          (length(unaccent(${search})) >= 4 AND unaccent(sc.subcategory_name) ILIKE unaccent(${pattern})) OR
          unaccent(p.product_name) ILIKE unaccent(${pattern}) OR
          WORD_SIMILARITY(unaccent(p.product_name), unaccent(${search})) > 0.45
      `

      count = (response as Array<{ total: number }>)[0].total;
    }

    return NextResponse.json([{ total: count }]);
  } catch {
    return NextResponse.json(
      { message: 'Error interno del servidor al contar productos' },
      { status: 500 }
    );
  }
}



