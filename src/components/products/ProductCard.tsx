import Image from "next/image";
import Link from "next/link";

import { cn } from "@/libs/utils";
import { ProductType } from "@/types";
import { formatPrice } from "@/utils";

type ProductCardProps = {
  product: ProductType;
  classNames?: string;
};

export const ProductCard = ({ product, classNames }: ProductCardProps) => {
  // Imagen - las imágenes vienen como array de strings con URLs de Cloudinary
  const image = product?.images?.[0] || "/img/image-icon.png";

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`bg-white rounded-xl overflow-hidden border ${classNames}`}
    >
      <div className="p-6 flex justify-center">
        <Image
          src={image}
          alt={product.name}
          width={150}
          height={150}
          className="object-contain h-[150px]"
        />
      </div>
      <div className="p-4 border-t h-52 flex flex-col">
        <h3 className="font-medium text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.category}</p>

        {/* TODO: Implementar cuotas */}
        {/* {installmentQuantity !== 0 && (
          <div className={cn("mt-auto flex items-center gap-1 
          text-sm text-secondary", discountPercent === 0 ? 
          "mb-1.5" : "mb-3")}> 
            {installmentQuantity} CUOTAS DE
            <span className="font-subheading">
              {formatPrice(installmentPrice)}
            </span>
          </div>
        )} */}

        {product.discountPercent > 0 && product.originalPrice && (
          <div className={cn("flex items-center gap-2 mb-1 mt-auto")}>
            <span
              className="text-xs font-subheading text-white px-1.5 py-0.5 rounded bg-primary"
            >
              {product.discountPercent}% OFF
            </span>
            <span className="text-sm line-through text-gray-500">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
        )}

        <div
          className={cn(
            "text-xl font-subheading",
            product.discountPercent === 0 && "mt-auto"
            // installmentQuantity === 0 &&
          )}
        >
          {formatPrice(product.price)}
        </div>
      </div>
    </Link>
  );
};

