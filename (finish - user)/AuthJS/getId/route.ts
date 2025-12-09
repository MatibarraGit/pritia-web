import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email es requerido" },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const user = await prisma.users.findFirst({
      where: {
        email: email,
      },
      select: {
        user_id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "El usuario no existe" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user_id: user.user_id,
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json(
      { message: 'Error en el servidor al obtener usuario' },
      { status: 500 }
    );
  }
}







