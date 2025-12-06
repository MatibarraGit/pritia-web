import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
// import { auth } from "@/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Verificar si el usuario existe
    const userExists = await prisma.users.findUnique({
      where: {
        user_id: parseInt(id),
      },
    });

    if (!userExists) {
      return NextResponse.json(
        { success: false, message: "El administrador no existe" },
        { status: 404 }
      );
    }

    // Verificar si es el último usuario
    const userCount = await prisma.users.count();

    if (userCount <= 1) {
      return NextResponse.json(
        { success: false, message: "No se puede eliminar el último administrador del sistema" },
        { status: 400 }
      );
    }

    // Eliminar el usuario
    await prisma.users.delete({
      where: {
        user_id: parseInt(id),
      },
    });

    return NextResponse.json({ success: true, message: "Administrador eliminado con éxito" });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { message: 'Error en el servidor al eliminar administrador' },
      { status: 500 }
    );
  }
}







