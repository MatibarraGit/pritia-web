import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: providerId } = await params;
  const id = parseInt(providerId);

  try {
    const { providerName } = await req.json();

    // Validaciones
    if (!providerName || providerName.trim() === '') {
      return NextResponse.json(
        { message: 'El nombre del proveedor es obligatorio' },
        { status: 400 }
      );
    } else if (providerName.length < 3) {
      return NextResponse.json(
        { message: 'El nombre debe tener al menos 3 carácteres' },
        { status: 400 }
      );
    }

    // Actualizar solo si no existe otro proveedor con el mismo nombre
    const result: number = await prisma.$executeRaw`
      UPDATE providers
      SET provider_name = ${providerName.trim()}
      WHERE provider_id = ${id}
        AND NOT EXISTS (
          SELECT 1 FROM providers
          WHERE provider_name = ${providerName.trim()}
        )
    `;

    if (result === 0) {
      return NextResponse.json(
        { message: 'El proveedor que desea ingresar ya existe' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Proveedor modificado con éxito" });
  } catch (error) {
    return NextResponse.json(
      { message: `Error al modificar proveedor: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: providerId } = await params;
  const id = parseInt(providerId);

  try {
    const result: number = await prisma.$executeRaw`
      DELETE FROM providers
      WHERE provider_id = ${id}
        AND NOT EXISTS (
          SELECT 1 FROM products
          WHERE provider_id = ${id}
        )
    `;

    if (result === 0) {
      return NextResponse.json(
        { message: 'No se pudo eliminar. Verificá que no haya productos asociados a este proveedor y volvé a intentarlo' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Proveedor eliminado con éxito",
    });
  } catch (error) {
    return NextResponse.json(
      { message: `Error al eliminar proveedor: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}







