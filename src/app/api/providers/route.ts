import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET() {
  try {
    const providers = await prisma.providers.findMany({
      orderBy: {
        provider_id: 'asc',
      },
    });

    if (providers.length === 0) {
      return NextResponse.json({ message: 'No se encontraron proveedores' });
    }

    return NextResponse.json(providers);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return NextResponse.json(
      { message: `Error al obtener proveedores: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { providerName } = await req.json();

    // Validaciones
    if (!providerName || providerName.trim() === '') {
      return NextResponse.json(
        { message: 'El nombre del proveedor es obligatorio' },
        { status: 400 }
      );
    } else if (providerName.trim().length < 3) {
      return NextResponse.json(
        { message: 'El nombre debe tener al menos 3 carácteres' },
        { status: 400 }
      );
    }

    const provider = await prisma.providers.create({
      data: {
        provider_name: providerName.trim(),
      },
      select: {
        provider_id: true,
      },
    });

    return NextResponse.json({
      message: 'Proveedor creado',
      proveedor: { id: provider.provider_id },
    });
  } catch (error) {
    if ( error && typeof error === 'object' && 'name' in error && error?.name === 'PrismaClientKnownRequestError' ) {
      const prismaError = error as PrismaClientKnownRequestError;
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { message: 'El proveedor que desea ingresar ya existe' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { message: `Error al insertar proveedor: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}