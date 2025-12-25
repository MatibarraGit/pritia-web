import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

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