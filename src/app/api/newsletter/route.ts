import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const errors: Record<string, string> = {};

    switch (true) {
      case !email:
        errors.email = "El email es requerido";
        break;

      case typeof email !== "string":
        errors.email = "El email debe ser un texto";
        break;

      case email.trim().length === 0:
        errors.email = "El email no puede estar vacío";
        break;

      case !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email):
        errors.email = "El formato del email no es válido";
        break;

      default:
        // El email es válido
        break;
    }

    // Si hay errores de validación, retornar antes de insertar
    if (errors.email) {
      return NextResponse.json(
        { message: errors.email },
        { status: 400 }
      );
    }

    // Insertar el email
    await prisma.newsletter_emails.create({
      data: {
        email: email.trim(),
      },
    });

    return NextResponse.json(
      { message: 'Gracias por registrarte!', email },
      { status: 201 }
    );
  } catch (error: unknown) {    
    // Verificar si es un error de Prisma verificando las propiedades
    if ( error && typeof error === 'object' && 'name' in error && error?.name === 'PrismaClientKnownRequestError' ) {
      const prismaError = error as PrismaClientKnownRequestError;
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { message: 'Ya se registró este email' },
          { status: 409 }
        );
      }
    }

    // Manejar otros errores
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}



