import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

import { LikeButton, ProductImages, ProductActions, ProductHeader, ProductPricing, ProductShippingInfo, ProductDescription, ProductsCarousel } from "@/components";
import { getProductsBySubcategory } from "@/services";

import type { Metadata } from "next";
import type { ProductType } from "@/types";


type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string): Promise<ProductType | null> {
  try {
    // En Server Components, usar URL absoluta o relativa según el entorno
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/products/slug/${slug}`;
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return { title: "Producto no encontrado" };
  }
  
  return { 
    title: { absolute: product.name },
    description: product.description || product.name,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return notFound();

  const {
    id,
    images,
    name,
    price,
    originalPrice,
    discountPercent,
    category,
    subcategory,
    inStock,
    stock,
    description
  } = product

  // Cuotas
  // const installmentQuantity = installmentQuantity ? installmentQuantity : 0;
  // const installmentPrice = (finalPrice / installmentQuantity) * 1.20;

  // ----Productos relacionados----
  const relatedProducts = (await getProductsBySubcategory({ subcategory })) ?? [];
  const filteredRelatedProducts = relatedProducts?.products?.filter((p: ProductType) => String(p.id) !== String(id));
  

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="w-11/12 max-w-content mx-auto container py-3">
          <div className="flex items-center flex-wrap text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/products" className="hover:text-primary">
              Productos
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link
              href={`/products?category=${category}`}
              className="hover:text-primary"
            >
              {category}
            </Link>
            {subcategory && (
              <>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link
                  href={`/products?subcategory=${subcategory}`}
                  className="hover:text-primary"
                >
                  {subcategory}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="font-medium text-gray-900">{name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="w-11/12 max-w-content mx-auto container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="relative">
            <ProductImages images={images} name={name} />
            <LikeButton product={product} classNames="absolute top-2 right-2" />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <ProductHeader name={name} />

            <ProductPricing
              price={price}
              originalPrice={originalPrice}
              discountPercent={discountPercent}
              inStock={inStock}
              stock={stock}
            />

            <ProductActions product={product} />

            <ProductShippingInfo />
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          {/* <ProductTabs description={description} /> */}
          <ProductDescription description={description} />
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-subheading">Productos relacionados</h2>

            <ProductsCarousel products={filteredRelatedProducts} isAutoplay={false} loop={false} />
          </div>
        )}
      </div>
    </div>
  );
}
