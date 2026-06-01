import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { auth } from "@/libs/auth";
import { cloudinary, prisma } from "@/libs";
import { getPublicIdFromUrl } from "@/utils";

type BulkDeleteBody = {
  productIds?: unknown;
};

type ProductToDelete = {
  product_id: number;
  product_name: string;
  images: string[];
};

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session?.session) {
    return NextResponse.json(
      { message: "No se ha podido autenticar el usuario" },
      { status: 401 }
    );
  }

  let body: BulkDeleteBody;

  try {
    body = (await req.json()) as BulkDeleteBody;
  } catch {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es valido" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.productIds) || body.productIds.length === 0) {
    return NextResponse.json(
      { message: "Se requiere al menos un producto para eliminar" },
      { status: 400 }
    );
  }

  const invalidProductIds = body.productIds.filter(
    (productId) => !Number.isInteger(productId) || Number(productId) <= 0
  );

  if (invalidProductIds.length > 0) {
    return NextResponse.json(
      { message: "La lista de productos contiene identificadores invalidos" },
      { status: 400 }
    );
  }

  const productIds = [...new Set(body.productIds as number[])];

  try {
    const products = await prisma.products.findMany({
      where: {
        product_id: {
          in: productIds,
        },
      },
      select: {
        product_id: true,
        product_name: true,
        images: true,
      },
    });

    const foundProductIds = new Set(products.map((product) => product.product_id));
    const missingProductIds = productIds.filter((productId) => !foundProductIds.has(productId));

    if (missingProductIds.length > 0) {
      return NextResponse.json(
        {
          message: "No se encontraron todos los productos seleccionados",
          missingProductIds,
        },
        { status: 404 }
      );
    }

    const purchaseOrderItems = await prisma.purchase_order_items.groupBy({
      by: ["product_id"],
      where: {
        product_id: {
          in: productIds,
        },
      },
      _count: {
        product_id: true,
      },
    });

    if (purchaseOrderItems.length > 0) {
      const blockedProductIds = purchaseOrderItems.map((item) => item.product_id);
      const blockedProducts = products.filter((product) => blockedProductIds.includes(product.product_id));
      const blockedNames = blockedProducts
        .slice(0, 3)
        .map((product) => product.product_name)
        .join(", ");
      const extraCount = blockedProductIds.length - blockedProducts.slice(0, 3).length;

      return NextResponse.json(
        {
          message: `No se pueden eliminar ${blockedProductIds.length} producto(s) porque tienen ordenes de compra asociadas${blockedNames ? `: ${blockedNames}${extraCount > 0 ? ` y ${extraCount} mas` : ""}` : ""}`,
          blockedProductIds,
        },
        { status: 409 }
      );
    }

    const imageDeleteResult = await deleteProductImages(products);

    if (!imageDeleteResult.success) {
      return NextResponse.json(
        {
          message: "No se pudieron eliminar las imagenes de Cloudinary. No se elimino ningun producto.",
          failedImageCount: imageDeleteResult.failedImageCount,
        },
        { status: 502 }
      );
    }

    const deleteResult = await prisma.products.deleteMany({
      where: {
        product_id: {
          in: productIds,
        },
      },
    });

    if (deleteResult.count !== productIds.length) {
      return NextResponse.json(
        {
          message: "No se pudieron eliminar todos los productos seleccionados",
          deletedCount: deleteResult.count,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `${deleteResult.count} producto(s) eliminado(s)`,
      success: true,
      deletedProductIds: productIds,
      deletedCount: deleteResult.count,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            message: "No se pueden eliminar productos con registros relacionados",
          },
          { status: 409 }
        );
      }
    }

    console.error("[products bulk-delete]", error);
    return NextResponse.json(
      { message: "Error interno del servidor al eliminar productos" },
      { status: 500 }
    );
  }
}

async function deleteProductImages(products: ProductToDelete[]) {
  const deleteResults = await Promise.allSettled(
    products.flatMap((product) =>
      product.images.map(async (image) => {
        const publicId = await getPublicIdFromUrl(image);
        if (!publicId) return;

        await cloudinary.uploader.destroy(publicId);
      })
    )
  );

  const failedImageCount = deleteResults.filter((result) => result.status === "rejected").length;

  return {
    success: failedImageCount === 0,
    failedImageCount,
  };
}
