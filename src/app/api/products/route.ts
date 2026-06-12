import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/libs/auth";
import { default as cloudinary } from "@/libs/cloudinary";
import { prisma } from '@/libs/prisma';

import { PRODUCTS_PER_PAGE, convertImageToBuffer, formatProducts } from "@/utils";
import type { ProductResponseType } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') ?? "";
    const page = parseInt(searchParams.get('page') ?? '1');
    const offset = (page - 1) * PRODUCTS_PER_PAGE;

    const pattern = `%${search}%`;

    const products = await prisma.$queryRaw<Array<ProductResponseType>>`
      SELECT 
        p.*, 
        COALESCE(array_agg(pr.provider_name ORDER BY pr.provider_name) FILTER (WHERE pr.provider_name IS NOT NULL), ARRAY[]::text[]) AS provider_names,
        c.category_name, 
        sc.subcategory_name
      FROM products p
      LEFT JOIN providers pr ON pr.provider_id = ANY(p.provider_ids)
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN subcategories sc on sc.subcategory_id = p.subcategory_id
      WHERE (
        unaccent(p.product_name) ILIKE unaccent(${pattern})
        OR WORD_SIMILARITY(unaccent(p.product_name), unaccent(${search})) > 0.45
        OR p.product_id::TEXT LIKE ${pattern}
      )
      GROUP BY p.product_id, c.category_name, sc.subcategory_name
      ORDER BY 
        in_stock DESC,
        CASE
          WHEN p.product_id::TEXT LIKE ${search} THEN 1
          WHEN p.product_id::TEXT LIKE '%' || ${search} THEN 2
          WHEN p.product_id::TEXT LIKE ${pattern} THEN 3
          -- El product_name entero es igual al search
          WHEN unaccent(p.product_name) ILIKE unaccent(${search}) THEN 4
          -- Busca una coincidencia de palabra completa dentro del texto (ej: "Cama" o "Cama de...")
          WHEN unaccent(p.product_name) ~* ('\\m' || unaccent(${search}) || '\\M') THEN 5
          -- Contiene el término buscado en cualquier parte del product_name
          WHEN unaccent(p.product_name) ILIKE unaccent(${pattern}) THEN 6
          ELSE 7
        END,
        COALESCE(updated_at, created_at) DESC,
        WORD_SIMILARITY(unaccent(p.product_name), unaccent(${search})) DESC
      LIMIT ${PRODUCTS_PER_PAGE} 
      OFFSET ${offset}
    `

    if (products.length === 0) {
      return NextResponse.json([]);
    }

    const total = await prisma.$queryRaw<[{ count: number }]>`
      SELECT COUNT(*)::INTEGER
      FROM products p
      WHERE 
        (p.product_name ILIKE ${pattern} OR p.product_id::TEXT LIKE ${pattern})
    `;

    return NextResponse.json({ 
      products: formatProducts(products),
      total: total[0].count
     });
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener productos' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ 
    headers: await headers()
  })

  if (!session?.user || !session?.session) {
    return NextResponse.json(
      { message: 'No se ha podido autenticar el usuario' },
      { status: 401 }
    );
  }

  try {
    // Obtener datos
    const data = await req.formData();

    const files = data.getAll('images');
    const name = data.get('name') as string;
    const provider = data.get('provider') as string;
    const purchasePrice = data.get('purchasePrice') as string;
    const price = data.get('price') as string;
    const resellersPrice = data.get('resellersPrice') as string;
    const discountPercent = data.get('discountPercent') as string;
    const category = data.get('category') as string;
    const subcategory = data.get('subcategory') as string;
    const inStockString = data.get('inStock') as string;
    const inStock = inStockString === 'Disponible' ? true : false;
    const stock = data.get('stock') as string;
    const description = data.get('description') as string;
    const updatedAt = data.get('updatedAt') as string;

    // Validaciones
    if (!Array.isArray(files) || files.length < 1) {
      return NextResponse.json(
        { message: 'Se requiere al menos 1 imagen' },
        { status: 400 }
      );
    }
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { message: 'El nombre del producto es obligatorio' },
        { status: 400 }
      );
    }
    if (!provider || provider.trim() === '') {
      return NextResponse.json(
        { message: 'El proveedor es obligatorio' },
        { status: 400 }
      );
    }
    if (isNaN(Number(purchasePrice)) || Number(purchasePrice) < 1000) {
      return NextResponse.json(
        { message: 'Se requiere un precio de compra mayor o igual a 1000' },
        { status: 400 }
      );
    }
    if (isNaN(Number(price)) || Number(price) < 1000) {
      return NextResponse.json(
        { message: 'Se requiere un precio de venta mayor o igual a 1000' },
        { status: 400 }
      );
    }
    if (isNaN(Number(resellersPrice)) || Number(resellersPrice) < 1000) {
      return NextResponse.json(
        { message: 'Se requiere un precio para revendedores mayor o igual a 1000' },
        { status: 400 }
      );
    }
    if (!category || category.trim() === '') {
      return NextResponse.json(
        { message: 'La categoría es obligatoria' },
        { status: 400 }
      );
    }
    if (!subcategory || subcategory.trim() === '') {
      return NextResponse.json(
        { message: 'La subcategoría es obligatoria' },
        { status: 400 }
      );
    }
    if (inStock === undefined || inStock === null) {
      return NextResponse.json(
        { message: 'La disponibilidad es obligatoria' },
        { status: 400 }
      );
    }
    if (!stock || isNaN(Number(stock))) {
      return NextResponse.json(
        { message: 'El stock es obligatorio' },
        { status: 400 }
      );
    }
    // Validar que updatedAt sea una fecha válida si existe
    const updatedAtDate = new Date(updatedAt);
    if ((updatedAt || updatedAt.trim() !== '') && (isNaN(updatedAtDate.getTime()))) {
      return NextResponse.json(
        { message: 'La fecha de actualización no es válida' },
        { status: 400 }
      );
    }

    const imagesUrls: string[] = [];

    // Construir buffers y metadatos
    for (const file of files) {
      if (file instanceof File) {
        const buffer = await convertImageToBuffer(file);

        const cloudinaryRes = await new Promise<{ secure_url: string }>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'Products',
              public_id: `${name}-${Date.now().toLocaleString()}-${Math.random().toString(36).slice(2, 7)}`,
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result as { secure_url: string });
            }
          ).end(buffer);
        });

        imagesUrls.push(cloudinaryRes.secure_url);
      }
    }

    // Crear el producto
    const product = await prisma.products.create({
      data: {
        product_name: name,
        ...({ provider_ids: [parseInt(provider)] } as Record<string, number[]>),
        purchase_price: parseInt(purchasePrice),
        sell_price: parseInt(price),
        resellers_price: parseInt(resellersPrice),
        discount_percent: parseInt(discountPercent),
        category_id: parseInt(category),
        subcategory_id: parseInt(subcategory),
        in_stock: inStock,
        stock: parseInt(stock),
        product_description: description || null,
        images: imagesUrls,
        updated_at: updatedAtDate || null,
      },
      select: {
        product_slug: true,
      },
    });

    if (!product.product_slug) {
      return NextResponse.json(
        { message: 'No se ha podido crear el producto, probablemente ya exista un producto con ese nombre' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Producto creado',
      slug: product.product_slug,
    });
  } catch (error) {
    console.log(error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { message: 'El nombre del producto ya existe, los nombres deben ser únicos' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Error interno del servidor al crear producto' },
      { status: 500 }
    );
  }
}
