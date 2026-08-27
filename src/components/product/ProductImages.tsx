"use client";

import { useMemo, useState } from "react";

import { ProductImagesDesktop } from "./product-images/ProductImagesDesktop";
import { ProductImagesMobile } from "./product-images/ProductImagesMobile";

interface ProductImagesProps {
  images: string[];
  name: string;
}

const FALLBACK_IMAGE = "/img/image-icon.webp";

export function ProductImages({
  images,
  name
}: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const safeImages = useMemo(() => {
    const validImages = images.filter((image) => image.trim().length > 0);

    return validImages.length > 0 ? validImages : [FALLBACK_IMAGE];
  }, [images]);
  const selectedImageIndex =
    selectedImage < safeImages.length ? selectedImage : 0;

    return (
      <div className="relative">
        <ProductImagesDesktop
          images={safeImages}
          name={name}
          selectedImage={selectedImageIndex}
          onSelectImage={setSelectedImage}
        />
        <ProductImagesMobile images={safeImages} name={name} />
      </div>
    );
  }
