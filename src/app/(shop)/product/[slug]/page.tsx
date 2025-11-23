import Link from "next/link";
import { ChevronRight, Truck, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductImages } from "@/components/product/ProductImages";
import { ProductActions } from "@/components/product/ProductActions";
import { formatPrice } from "@/utils";
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
        <div className="w-11/12 max-width-screen mx-auto container py-3">
          <div className="flex items-center text-sm text-gray-500">
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
      <div className="w-11/12 max-width-screen mx-auto container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <ProductImages images={images} name={name} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-subheading text-gray-900">
                {name}
              </h1>
            </div>

            <div className="space-y-2">
              {discountPercent > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-white">
                    {discountPercent}% OFF
                  </Badge>
                </div>
              )}

              {originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-gray-500">
                    {formatPrice(originalPrice)}
                  </span>
                </div>
              )}

              <div className="text-3xl font-subheading" style={{ color: "#000" }}>
                {formatPrice(price)}
              </div>

              {inStock ? (
                <div className="mt-4 text-sm text-green-600">
                  <span className="font-medium">✓ En stock</span>
                  {stock > 0 && (
                    <span className="ml-2 text-gray-600">
                      ({stock} disponibles)
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-sm text-red-600">
                  <span className="font-medium">✗ Sin stock</span>
                </div>
              )}
            </div>

            <ProductActions product={product} />

            <div className="flex flex-col gap-4 pt-4 md:flex-row">
              <div className="flex items-center space-x-2 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <span>Envío todo el país</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Aceptamos tarjetas de crédito</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-4 py-2"
              >
                Descripción
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-4 py-2"
              >
                Especificaciones
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <div className="bg-white p-6 rounded-lg border">
                <p className="text-gray-700 mb-6">
                  {description || "No hay descripción disponible para este producto."}
                </p>
                {/* {features && (
                  <>
                    <h3 className="font-subheading text-lg mb-4">
                      Características principales
                    </h3>
                    <ul className="space-y-2">
                      {features.split('\n').map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          <span>{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )} */}
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="pt-6">
              <div className="bg-white p-6 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* {specifications.map((spec, index) => (
                    <div key={index} className="py-3 border-b last:border-b-0">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          {spec.name}
                        </span>
                        <span className="text-gray-900">{spec.value}</span>
                      </div>
                    </div>
                  ))} */}
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
