"use client";

import { ProductImages, ProductHeader, ProductPricing, ProductTabs } from "@/components";

interface ProductImage {
  img_url?: string;
  img_alt?: string;
  file?: File;
}

interface ProductPreviewProps {
  productData: {
    images: (string | ProductImage)[];
    name: string;
    price: number;
    discountPercent: number;
    category: string;
    subcategory: string;
    inStock: string;
    stock: number;
    description: string;
  };
}

export function ProductPreview({ productData }: ProductPreviewProps) {
  // Convertir imágenes al formato esperado por ProductImages
  const images = productData.images.map((img) => {
    if (typeof img === "string") {
      return img;
    }
    return img.img_url || "";
  }).filter(Boolean);

  // Calcular precio final
  // El precio en productData es el precio de venta (originalPrice si hay descuento)
  const basePrice = productData.price;
  const discountValue = Math.floor(basePrice * (productData.discountPercent / 100));
  const finalPrice = Math.floor(basePrice - discountValue);
  const displayPrice = productData.discountPercent > 0 ? finalPrice : basePrice;
  const originalPrice = productData.discountPercent > 0 ? basePrice : undefined;

  // Crear objeto producto para ProductImages
  const productName = productData.name || "NOMBRE DEL PRODUCTO";

  // Convertir inStock de string a boolean
  const inStock = productData.inStock === "Disponible";

  return (
    <div className="w-full bg-gray-50 rounded-lg border p-4 md:p-6">
      <h3 className="text-xl font-semibold mb-6">Vista Previa</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Imágenes del Producto */}
        {images.length > 0 ? (
          <ProductImages images={images} name={productName} />
        ) : (
          <div className="bg-white rounded-lg border flex items-center justify-center h-64">
            <p className="text-muted-foreground">Sin imágenes</p>
          </div>
        )}

        {/* Información del Producto */}
        <div className="space-y-6">
          <ProductHeader name={productData.name || "NOMBRE DEL PRODUCTO"} />

          <ProductPricing
            price={displayPrice}
            originalPrice={originalPrice}
            discountPercent={productData.discountPercent}
          />

          {/* Categoría */}
          {productData.category && (
            <div className="pt-2">
              <span className="text-sm text-muted-foreground">
                Categoría: <span className="font-medium text-gray-900">{productData.category}</span>
              </span>
              {productData.subcategory && (
                <span className="text-sm text-muted-foreground ml-2">
                  / <span className="font-medium text-gray-900">{productData.subcategory}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Descripción */}
      <div className="mt-12">
        <ProductTabs description={productData.description} />
      </div>
    </div>
  );
}

