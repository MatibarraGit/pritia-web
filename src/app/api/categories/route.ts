import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { CategoryType } from "@/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

export async function POST(req: Request) {
  try {
    const { categoryName } = await req.json();

    // Validaciones
    if (!categoryName || categoryName.trim() === '') {
      return NextResponse.json(
        { message: 'El nombre de la categoría es obligatorio' },
        { status: 400 }
      );
    } else if (categoryName.trim().length < 3) {
      return NextResponse.json(
        { message: 'El nombre debe tener al menos 3 carácteres' },
        { status: 400 }
      );
    }

    const category = await prisma.categories.create({
      data: {
        category_name: categoryName.trim(),
      },
      select: {
        category_id: true,
      },
    });

    return NextResponse.json({
      message: 'Categoría creada',
      categoria: { id: category.category_id },
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error?.name === 'PrismaClientKnownRequestError') {
      const prismaError = error as PrismaClientKnownRequestError;
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { message: 'La categoría que desea ingresar ya existe' },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { message: `Error al insertar categoría: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}








