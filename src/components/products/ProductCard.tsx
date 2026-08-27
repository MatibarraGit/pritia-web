/* eslint-disable @next/next/no-img-element */
import { memo } from "react";
import Link from "next/link";

import { cn } from "@/libs/utils";
import { LikeButton } from "@/components";
import { ProductType } from "@/types";
import { cldSrcSet, cldUrl, formatPrice } from "@/utils";

type ProductCardProps = {
  product: ProductType;
  classNames?: string;
  imageSizes?: string;
  /** true sólo para las tarjetas visibles al cargar (above the fold) */
  priority?: boolean;
};

/** Ancho real que ocupa la imagen en la tarjeta (h-40 / ~250px de ancho) */
const CARD_IMAGE_WIDTH = 300;

export const ProductCard = memo(function ProductCard({
  product,
  classNames,
  imageSizes = "(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 250px",
  priority = false,
}: ProductCardProps) {
  const hasDiscount = product.discountPercent > 0 && product.originalPrice;
  // const isHotSale = EVENTS.IS_HOT_SALE && hasDiscount;
  const savings = hasDiscount ? product.originalPrice! - product.price : 0;

  // Imagen - las imágenes vienen como array de strings con URLs de Cloudinary
  const rawImage = product?.images?.[0] || "/img/image-icon.webp";
  const image = cldUrl(rawImage, { width: CARD_IMAGE_WIDTH, quality: "auto:eco" });
  const imageSrcSet = cldSrcSet(rawImage, CARD_IMAGE_WIDTH, "auto:eco");

  // const productToCheckout = !isHotSale ? undefined : {
  //   id: product.id,
  //   image: product.images[0] || "/img/image-icon.webp",
  //   name: product.name,
  //   price: product.price,
  //   quantity: 1,
  //   slug: product.slug,
  // };

  return (
    <Link
      href={`/producto/${product.slug}`}
      className={`bg-white rounded-xl overflow-hidden border ${classNames}`}
    >
      <div className="flex justify-center relative">
        {/* <Image
          src={image}
          alt={product.name}
          width={250}
          height={250}
          sizes={imageSizes}
          quality={70}
          className="object-contain h-40 select-none"
          draggable={false}
        /> */}

        <img
          src={image}
          srcSet={imageSrcSet}
          alt={product.name}
          width={250}
          height={250}
          sizes={imageSizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="object-contain h-40 select-none"
          draggable={false}
        />

        {/* Badge Hot Sale */}
        {/* {isHotSale && (
          <span className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded">
            🔥 Hot Sale
          </span>
        )} */}
      </div>

      <div className={cn(
        "p-4 border-t flex flex-col h-60",
        // hasDiscount ? "h-auto" : "h-52"
        )}>
        <h3 className="font-medium text-lg line-clamp-2 overflow-hidden">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1 mb-2">{product.category}</p>

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

        {/* Stock */}
        {(product.stock > 0 && product.stock < 10) && (
          <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded mb-4 w-fit bg-orange-100 text-orange-700">
            ⚠ ¡Solo queda{product.stock === 1 ? ' 1 unidad!' : `n ${product.stock} unidades!`} 
          </div>
        )}

        {hasDiscount && (
          <div className="flex flex-col justify-center gap-1">
            <span className="text-sm line-through text-gray-500">
              {formatPrice(product.originalPrice!)}
            </span>

            <span
              className="w-fit text-xs font-subheading text-white px-1.5 py-0.5 rounded bg-primary"
              // isHotSale ? "bg-orange-500" : "bg-primary"
              >
              {product.discountPercent}% OFF
            </span>
          </div>
        )}

        <div className={cn(
          "flex items-center justify-between relative",
          (product.discountPercent === 0 || !product.category) && "mt-auto",
          // installmentQuantity === 0 &&
        )}>
          <div className="flex flex-col">
            <span className="text-xl font-subheading">
              {formatPrice(product.price)}
            </span>

            {/* Ahorro en pesos */}
            {hasDiscount && (
              <div className="mt-1 mb-3 flex flex-col gap-2 text-xs text-green-600">
                <div className="center-flex gap-1"> 
                  <strong>Ahorrás</strong>
                  <span>{formatPrice(savings)}</span>
                </div>

                {/* <span className="center-flex gap-1 rounded-lg bg-green-400/20"> 
                  Envío 
                  <strong>GRATIS</strong>
                </span> */}
              </div>
            )}
          </div>

          <LikeButton product={product} />
        </div>

        {/* Envío gratis + CTA Hot Sale */}
        {/* {isHotSale && (
          <CheckoutButton 
            items={productToCheckout!}
            text="Aprovechar oferta"
            classname="w-full bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-medium py-2 rounded-lg"
          />
        )} */}
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
