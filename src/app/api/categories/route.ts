import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { CategoryType } from "@/types";

export async function GET() {
  try {
    const categories: CategoryType[] = await prisma.$queryRaw`
      SELECT 
      c.category_id::integer,
      c.category_name,
      json_agg(
        json_build_object(
          'id', sc.subcategory_id::integer,
          'name', sc.subcategory_name
        )
      ) AS subcategories
      FROM categories c
      LEFT JOIN subcategories sc ON sc.category_id = c.category_id
      GROUP BY c.category_id, c.category_name
      ORDER BY c.category_name;  
    `;

    if (categories.length === 0) {
      return NextResponse.json({ message: 'No se encontraron categorías' });
    }

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { message: `Error al obtener categorías: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}