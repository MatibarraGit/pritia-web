import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: categoryId } = await params;
  const id = parseInt(categoryId);

  try {
    const { categoryName } = await req.json();

    // Validaciones
    if (!categoryName || categoryName.trim() === '') {
      return NextResponse.json(
        { message: 'El nombre de la categoría es obligatorio' },
        { status: 400 }
      );
    } else if (categoryName.length < 3) {
      return NextResponse.json(
        { message: 'El nombre debe tener al menos 3 carácteres' },
        { status: 400 }
      );
    }

    // Actualizar solo si no existe otra categoría con el mismo nombre
    const result: number = await prisma.$executeRaw`
      UPDATE categories
      SET category_name = ${categoryName.trim()}
      WHERE category_id = ${id}
        AND NOT EXISTS (
          SELECT 1 FROM categories
          WHERE category_name = ${categoryName.trim()}
        )
    `;

    if (result === 0) {
      return NextResponse.json(
        { message: 'La categoría que desea ingresar ya existe' },
        { status: 400 }
      );
    }


    return NextResponse.json({ message: "Categoría modificada con éxito" });
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
      { message: `Error al editar categoría: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: categoryId } = await params;
  const id = parseInt(categoryId);

  try {
    // Eliminar solo si no hay productos asociados
    const result: number = await prisma.$executeRaw`
      DELETE FROM categories
      WHERE category_id = ${id}
        AND NOT EXISTS (
          SELECT 1 FROM products
          WHERE category_id = ${id}
        )
    `;

    if (result === 0) {
      return NextResponse.json(
        { message: 'No se pudo eliminar. Verificá que no haya productos asociados a esta categoría y volvé a intentarlo' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Categoría eliminada con éxito",
    });
  } catch (error) {
    return NextResponse.json(
      { message: `Error al eliminar categoría: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}







