import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { auth } from "@/libs/auth";
import { prisma, cloudinary } from "@/libs";
import { convertImageToBuffer, getPublicIdFromUrl, formatProduct, formatDate } from "@/utils";
import type { ProductType } from "@/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await prisma.products.findUnique({
      where: {
        product_id: parseInt(id),
        deleted_at: null,
      },
      include: {
        categories: {
          select: {
            category_name: true,
          },
        },
        subcategories: {
          select: {
            subcategory_name: true,
          },
        },
        providers: {
          select: {
            provider_name: true
          }
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Formatear el producto al formato estándar
    const formattedProduct: ProductType = formatProduct({
      product_id: product.product_id,
      product_name: product.product_name,
      provider_name: product.providers?.provider_name || '',
      purchase_price: product.purchase_price,
      sell_price: product.sell_price ?? 0,
      resellers_price: product.resellers_price ?? 0,
      discount_percent: product.discount_percent ?? 0,
      category_name: product.categories?.category_name || '',
      subcategory_name: product.subcategories?.subcategory_name || '',
      in_stock: product.in_stock,
      stock: product.stock ?? 0,
      product_description: product.product_description || '',
      product_slug: product.product_slug || '',
      images: product.images,
      created_at: formatDate(product.created_at).fechaMostrar,
      updated_at: product.updated_at ? product.updated_at.toISOString() : null,
    });

    return NextResponse.json(formattedProduct);
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener producto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ 
    headers: await headers()
  })

  if (!session?.user || !session?.session) {
    return NextResponse.json(
      { message: 'No se ha podido autenticar el usuario' },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    // Obtener datos
    const data = await req.formData();

    const initialImages = data.getAll('initialImages') as string[];
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
    const updatedAtDate = updatedAt ? new Date(updatedAt) : null;
    if ((updatedAt || updatedAt.trim() !== '') && (updatedAtDate && isNaN(updatedAtDate.getTime()))) {
      return NextResponse.json(
        { message: 'La fecha de actualización no es válida' },
        { status: 400 }
      );
    }

    let imagesUrls: string[] = [];

    if (JSON.stringify(files) === JSON.stringify(initialImages)) {
      imagesUrls = initialImages;
    } else {
      // Construir buffers y metadatos
      for (const file of files) {
        // Si la imagen ya existe en cloudinary, la agregamos a la lista de imágenes
        if (typeof file === 'string' && initialImages.includes(file)) imagesUrls.push(file);

        // Si la imagen es un archivo, la convertimos a buffer y la subimos a cloudinary
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

      // Eliminar imágenes de Cloudinary que no están en la lista de imágenes
      for (const url of initialImages) {
        if (!url || imagesUrls.includes(url)) continue;

        const publicId = await getPublicIdFromUrl(url);
        if (!publicId) continue;

        try {
          await cloudinary.uploader.destroy(publicId);
        } catch {
          throw new Error('Error al eliminar imagen de Cloudinary');
        }
      }
    };

    const product = await prisma.products.update({
      where: {
        product_id: parseInt(id),
      },
      data: {
        product_name: name,
        provider_id: parseInt(provider),
        purchase_price: parseFloat(purchasePrice),
        sell_price: parseFloat(price),
        resellers_price: parseFloat(resellersPrice),
        discount_percent: parseFloat(discountPercent),
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

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado con éxito',
      slug: product.product_slug,
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error?.name === 'PrismaClientKnownRequestError') {
      const prismaError = error as PrismaClientKnownRequestError;
      if (prismaError.code === 'P2002' || prismaError.code === 'P2025') {
        return NextResponse.json(
          { message: 'El nombre del producto ya existe, por favor intentá con otro' },
          { status: 400 }
        );
      }
    }
    console.log(error)
    return NextResponse.json(
      { message: 'Error interno del servidor al actualizar producto' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ 
    headers: await headers()
  })

  if (!session?.user || !session?.session) {
    return NextResponse.json(
      { message: 'No se ha podido autenticar el usuario' },
      { status: 401 }
    );
  }
  const { id } = await params;

  try {
    await prisma.products.update({
      where: {
        product_id: parseInt(id),
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return NextResponse.json({ message: "Producto deshabilitado con éxito", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error interno del servidor al deshabilitar producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ 
    headers: await headers()
  })

  if (!session?.user || !session?.session) {
    return NextResponse.json(
      { message: 'No se ha podido autenticar el usuario' },
      { status: 401 }
    );
  }
  
  const { id } = await params;

  try {
    // Eliminar el producto
    const product = await prisma.products.delete({
      where: {
        product_id: parseInt(id),
      },
      select: {
        images: true,
      },
    });

    // Eliminar imágenes de Cloudinary antes de eliminar el producto
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        const publicId = await getPublicIdFromUrl(image);
        if (!publicId) continue;

        try {
          await cloudinary.uploader.destroy(publicId);
        } catch {
          throw new Error('Error al eliminar imagen de Cloudinary');
        }
      }
    }

    return NextResponse.json({ message: "Producto eliminado con éxito", success: true });
  } catch (error) {
    console.log(error); // Error por foreing key en purchase-order-items
    return NextResponse.json(
      { message: 'Error interno del servidor al eliminar producto' },
      { status: 500 }
    );
  }
}



