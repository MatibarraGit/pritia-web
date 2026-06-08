"use server";

import { cloudinary } from "@/libs";
import { getPublicIdFromUrl } from "@/utils";

type ProductToDelete = {
  product_id: number;
  product_name: string;
  images: string[];
};

export async function deleteProductImages(products: ProductToDelete[]) {
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