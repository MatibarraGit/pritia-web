"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImagesProps {
  images: string[];
  name: string;
}

export function ProductImages({ images, name }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage] || images[0] || "/img/image-icon.png"}
          alt={name}
          width={600}
          height={600}
          className="w-full h-auto max-h-[600px] object-contain aspect-square"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer bg-white rounded border overflow-hidden ${
                selectedImage === index ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image || "/img/image-icon.png"}
                alt={`${name} - vista ${index + 1}`}
                width={150}
                height={150}
                className="w-full h-auto object-contain aspect-square"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


