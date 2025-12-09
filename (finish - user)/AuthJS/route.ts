import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
// import { auth } from "@/auth";

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        user_id: true,
        user_name: true,
        email: true,
        created_at: true,
      },
      orderBy: {
        user_id: 'asc',
      },
    });

    if (users.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { message: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, pwHash, role } = await req.json();

    if (!name || !email || !pwHash) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (role !== 'ADMIN' && role !== 'USER') {
      return NextResponse.json(
        { error: 'Rol inválido' },
        { status: 400 }
      );
    }

    const user = await prisma.users.create({
      data: {
        user_name: name,
        email: email,
        password: pwHash,
        role: (role || 'USER') as 'ADMIN' | 'USER',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'El usuario ya existe' },
        { status: 409 }
      );
    }
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}







