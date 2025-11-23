import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Obtener el usuario por email
    const user = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 204 }
      );
    }

    // Verificar la contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 204 }
      );
    }

    // No devolvemos la contraseña al cliente
    return NextResponse.json({
      id: user.user_id,
      name: user.user_name,
      email: user.email,
      emailVerified: null,
      image: null,
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}







