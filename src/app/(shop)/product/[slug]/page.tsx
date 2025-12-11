import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

import { LikeButton, ProductImages, ProductActions, ProductHeader, ProductPricing, ProductShippingInfo, ProductTabs } from "@/components";
import { ProductType } from "@/types";

import type { Metadata } from "next";

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
    title: product.name,
    description: product.description || product.name,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return notFound();

  const {
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

  if (!product) {
    notFound();
  }

  // Cuotas
  // const installmentQuantity = installmentQuantity ? installmentQuantity : 0;
  // const installmentPrice = (finalPrice / installmentQuantity) * 1.20;

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
          <ProductTabs description={description} />
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-subheading mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}
