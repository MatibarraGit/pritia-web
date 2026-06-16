import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { requireAdminSession } from "@/libs/auth-guards";
import { default as cloudinary } from "@/libs/cloudinary";
import { prisma } from '@/libs/prisma';

import { deleteProductImages } from "@/services";
import { convertImageToBuffer, getPublicIdFromUrl, formatProduct, formatDate } from "@/utils";
import type { ProductInlinePatchPayload, ProductType } from "@/types";

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
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Formatear el producto al formato estándar
    const providers = await prisma.providers.findMany({
      where: {
        provider_id: {
          in: getProductProviderIds(product),
        },
      },
      select: {
        provider_name: true,
      },
      orderBy: {
        provider_name: "asc",
      },
    });

    const formattedProduct: ProductType = formatProduct({
      product_id: product.product_id,
      product_name: product.product_name || '',
      provider_names: providers.map((provider) => provider.provider_name),
      purchase_price: product.purchase_price ?? 0,
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
      created_at: product.created_at ? formatDate(product.created_at).fechaMostrar : null,
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
  const authResult = await requireAdminSession();

  if (!authResult.success) {
    return authResult.response;
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
        ...({ provider_ids: [parseInt(provider)] } as Record<string, number[]>),
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
  const authResult = await requireAdminSession();

  if (!authResult.success) return authResult.response;
  const { id } = await params;

  // TODO: Que siempre sea multipart/form-data??
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: Partial<ProductInlinePatchPayload> = {};
    let imageEntries: FormDataEntryValue[] | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const patchValue = formData.get("patch");

      if (typeof patchValue === "string" && patchValue.trim().length > 0) {
        try {
          body = JSON.parse(patchValue) as Partial<ProductInlinePatchPayload>;
        } catch {
          return NextResponse.json({ message: "El patch del producto es invalido" }, { status: 400 });
        }
      }

      imageEntries = formData.getAll("images");
    } else {
      body = await req.json() as Partial<ProductInlinePatchPayload>;
    }

    let removedImagesForCloudinary: Array<{
      product_id: number;
      product_name: string;
      images: string[];
    }> = [];

    const data: {
      product_name?: string;
      product_description?: string | null;
      provider_ids?: number[];
      purchase_price?: number;
      sell_price?: number;
      resellers_price?: number;
      discount_percent?: number;
      in_stock?: boolean;
      stock?: number;
      category_id?: number;
      subcategory_id?: number | null;
      created_at?: Date;
      updated_at?: Date | null;
      images?: string[];
    } = {};

    // Validaciones
    if ("description" in body) {
      if (body.description !== null && typeof body.description !== "string") {
        return NextResponse.json({ message: "La descripción es inválida" }, { status: 400 });
      }
      const trimmed = typeof body.description === "string" ? body.description.trim() : "";
      data.product_description = trimmed.length > 0 ? trimmed : null;
    }

    if ("name" in body) {
      if (!body.name || body.name.trim() === "") {
        return NextResponse.json({ message: "El nombre del producto es obligatorio" }, { status: 400 });
      }
      data.product_name = body.name.trim();
    }

    if ("providerIds" in body) {
      if (!Array.isArray(body.providerIds) || body.providerIds.some((providerId) => !Number.isInteger(providerId))) {
        return NextResponse.json({ message: "Los proveedores seleccionados son inválidos" }, { status: 400 });
      }
      const providerIds = [...new Set(body.providerIds)];
      data.provider_ids = providerIds;
    }

    if ("purchasePrice" in body) {
      if (!Number.isFinite(body.purchasePrice) || Number(body.purchasePrice) < 1000) {
        return NextResponse.json({ message: "Se requiere un precio de compra mayor o igual a 1000" }, { status: 400 });
      }
      data.purchase_price = Number(body.purchasePrice);
    }

    if ("price" in body) {
      if (!Number.isFinite(body.price) || Number(body.price) < 1000) {
        return NextResponse.json({ message: "Se requiere un precio de venta mayor o igual a 1000" }, { status: 400 });
      }
      data.sell_price = Number(body.price);
    }

    if ("resellersPrice" in body) {
      if (!Number.isFinite(body.resellersPrice) || Number(body.resellersPrice) < 1000) {
        return NextResponse.json({ message: "Se requiere un precio para revendedores mayor o igual a 1000" }, { status: 400 });
      }
      data.resellers_price = Number(body.resellersPrice);
    }

    if ("discountPercent" in body) {
      if (!Number.isFinite(body.discountPercent) || Number(body.discountPercent) < 0 || Number(body.discountPercent) > 100) {
        return NextResponse.json({ message: "El descuento debe estar entre 0 y 100" }, { status: 400 });
      }
      data.discount_percent = Number(body.discountPercent);
    }

    if ("inStock" in body) {
      if (typeof body.inStock !== "boolean") {
        return NextResponse.json({ message: "La disponibilidad es inválida" }, { status: 400 });
      }
      data.in_stock = body.inStock;
    }

    if ("stock" in body) {
      if (!Number.isInteger(body.stock) || Number(body.stock) < 0) {
        return NextResponse.json({ message: "El stock debe ser un número entero mayor o igual a 0" }, { status: 400 });
      }
      data.stock = Number(body.stock);
    }

    if ("categoryId" in body) {
      if (!body.categoryId || !Number.isInteger(body.categoryId)) {
        return NextResponse.json({ message: "La categoría es obligatoria" }, { status: 400 });
      }
      data.category_id = body.categoryId;
    }

    if ("subcategoryId" in body) {
      if (body.subcategoryId !== null && (!body.subcategoryId || !Number.isInteger(body.subcategoryId))) {
        return NextResponse.json({ message: "La subcategoría es inválida" }, { status: 400 });
      }
      data.subcategory_id = body.subcategoryId;
    }

    if ("createdAt" in body) {
      if (!body.createdAt) {
        return NextResponse.json({ message: "La fecha de creación es obligatoria" }, { status: 400 });
      }
      const createdAtDate = new Date(body.createdAt);
      if (isNaN(createdAtDate.getTime())) {
        return NextResponse.json({ message: "La fecha de creación no es válida" }, { status: 400 });
      }
      data.created_at = createdAtDate;
    }

    if ("updatedAt" in body) {
      if (body.updatedAt === null || body.updatedAt === "") {
        data.updated_at = null;
      } else {
        const updatedAtDate = new Date(body.updatedAt as string);
        if (isNaN(updatedAtDate.getTime())) {
          return NextResponse.json({ message: "La fecha de actualización no es válida" }, { status: 400 });
        }
        data.updated_at = updatedAtDate;
      }
    }

    if (imageEntries !== null) {
      if (imageEntries.length === 0) {
        return NextResponse.json({ message: "Se requiere al menos 1 imagen" }, { status: 400 });
      }

      const existingProduct = await prisma.products.findUnique({
        where: {
          product_id: parseInt(id),
        },
        select: {
          product_id: true,
          product_name: true,
          images: true,
        },
      });

      if (!existingProduct) {
        return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
      }

      const nextImages: string[] = [];
      const uploadName = body.name?.trim() || existingProduct.product_name || String(existingProduct.product_id);

      for (const imageEntry of imageEntries) {
        if (typeof imageEntry === "string") {
          if (!isOwnCloudinaryProductImageUrl(imageEntry)) {
            return NextResponse.json({ message: "La URL de imagen debe ser de Cloudinary de esta cuenta" }, { status: 400 });
          }

          nextImages.push(imageEntry);
          continue;
        }

        if (!isValidProductImageFile(imageEntry)) {
          return NextResponse.json({ message: "Solo se aceptan imagenes jpg, png o webp de hasta 5mb" }, { status: 400 });
        }

        const uploadedUrl = await uploadProductImage(imageEntry, uploadName);
        nextImages.push(uploadedUrl);
      }

      if (nextImages.length === 0) {
        return NextResponse.json({ message: "Se requiere al menos 1 imagen" }, { status: 400 });
      }

      const removedImages = existingProduct.images.filter((image) => !nextImages.includes(image));

      removedImagesForCloudinary = removedImages.length > 0
        ? [
            {
              product_id: existingProduct.product_id,
              product_name: uploadName,
              images: removedImages,
            },
          ]
        : [];

      data.images = nextImages;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: "No se proporcionaron campos para actualizar" }, { status: 400 });
    }

    // Modificar el producto en la base de datos
    const product = await prisma.products.update({
      where: {
        product_id: parseInt(id),
      },
      data: {
        ...(data as Record<string, unknown>),
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
      },
    });

    const providers = await prisma.providers.findMany({
      where: {
        provider_id: {
          in: getProductProviderIds(product),
        },
      },
      select: {
        provider_name: true,
      },
      orderBy: {
        provider_name: "asc",
      },
    });

    if (removedImagesForCloudinary.length > 0) {
      const imageDeleteResult = await deleteProductImages(removedImagesForCloudinary);

      if (!imageDeleteResult.success) {
        console.error("[products PATCH image cleanup]", {
          productId: id,
          failedImageCount: imageDeleteResult.failedImageCount,
        });
      }
    }

    const formattedProduct: ProductType = formatProduct({
      product_id: product.product_id,
      product_name: product.product_name || '',
      provider_names: providers.map((provider) => provider.provider_name),
      purchase_price: product.purchase_price ?? 0,
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
      created_at: product.created_at,
      updated_at: product.updated_at,
    });

    return NextResponse.json({ message: "Producto actualizado con éxito", success: true, product: formattedProduct });
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error?.name === 'PrismaClientKnownRequestError') {
      const prismaError = error as PrismaClientKnownRequestError;
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { message: 'El nombre del producto ya existe, por favor intentá con otro' },
          { status: 400 }
        );
      }
      if (prismaError.code === 'P2003') {
        return NextResponse.json(
          { message: 'El proveedor, categoría o subcategoría seleccionada no existe' },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { message: 'Error interno del servidor al actualizar producto' },
      { status: 500 }
    );
  }
}

function getProductProviderIds(product: { provider_ids?: number[]; provider_id?: number[] }) {
  return product.provider_ids || product.provider_id || [];
}

// TODO: Revisar para separar en archivos y reutilizar
const PATCH_IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024;
const PATCH_IMAGE_ACCEPTED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function isOwnCloudinaryProductImageUrl(value: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return false;

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      url.pathname.startsWith(`/${cloudName}/image/upload/`)
    );
  } catch {
    return false;
  }
}

function isValidProductImageFile(file: File) {
  return file.size <= PATCH_IMAGE_MAX_FILE_SIZE && PATCH_IMAGE_ACCEPTED_TYPES.has(file.type);
}

async function uploadProductImage(file: File, productName: string) {
  const buffer = await convertImageToBuffer(file);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "Products",
        public_id: `${productName}-${Date.now().toString()}-${Math.random().toString(36).slice(2, 7)}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve((result as { secure_url: string }).secure_url);
      }
    ).end(buffer);
  });
}
