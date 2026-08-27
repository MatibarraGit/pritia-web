import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

import {
  LikeButton,
  ProductImages,
  ProductActions,
  ProductHeader,
  CreditCardSection,
  ProductPurchaseInfo,
  ProductDescription,
  ProductsCarousel
} from "@/components";
import { getProductsBySubcategory } from "@/services";

import type { Metadata } from "next";
import type { ProductType } from "@/types";
import { formatDate, toSlug } from "@/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string): Promise<ProductType | null> {
  try {
    // En Server Components, usar URL absoluta o relativa según el entorno
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/products/slug/${slug}`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (!response.ok) {
      return null;
    }

    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: { absolute: "Producto no encontrado" },
      description: "No hay contenido para mostrar",
    };
  }

  const imageToShow = product?.images !== null ? product.images[0] : "/image-icon.webp";

  return {
    title: product.name,
    description: product.description ?? "",

    keywords: [
      // TODO: Completar keywords y descripción alternativa
    ],
    alternates: { canonical: '/producto' },
    
    openGraph: {
      title: product.name,
      description: product.description ?? "",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/producto/${product.slug}`,
      siteName: "Pritia",
      images: [
        {
          url: imageToShow, // TODO: Como la convierto en 1.91:1?
          width: 1200,
          height: 630,
          alt: product.name
        }
      ]
    },
  
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description ?? "",
      images: imageToShow,
    },
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
    description,
    createdAt,
    updatedAt,
  } = product;
  
  const lastUpdate = updatedAt ? formatDate(updatedAt).fechaMostrar : formatDate(createdAt!).fechaMostrar;

  // ----Productos relacionados----
  const relatedProducts =
    (await getProductsBySubcategory({ subcategorySlug: toSlug(subcategory) })) ?? [];
  const filteredRelatedProducts = relatedProducts?.products?.filter(
    (p: ProductType) => String(p.id) !== String(id),
  );

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumbs */}
      <div className="hidden bg-gray-50/90 md:block">
        <div className="w-11/12 max-w-content mx-auto container py-3">
          <div className="flex items-center flex-wrap text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/productos" className="hover:text-primary">
              Productos
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link
              href={`/productos/${toSlug(category)}`}
              className="hover:text-primary"
            >
              {category}
            </Link>
            {subcategory && (
              <>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link
                  href={`/productos/${toSlug(category)}/${toSlug(subcategory)}`}
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
      <div className="w-full max-w-content mx-auto container py-8 px-4 bg-white md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="-my-2 md:hidden">
            <ProductHeader name={name} />
          </div>
          
          <div className="flex flex-col relative">
            <LikeButton product={product} classNames="p-2 absolute top-0 right-2 bg-gray-100 rounded-full md:right-0"/> 
            <ProductImages images={images} name={name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">

            <div className="hidden md:block">
              <ProductHeader name={name} />
            </div>

            <CreditCardSection
              price={price}
              originalPrice={originalPrice}
              discountPercent={discountPercent}
            />

            <ProductActions product={product} />

            {/* TODO: Implementar nuevamente cuando reactive los créditos personales */}
            {/* {price >= 40000 && (
              <ProductInstallmentsSection
              price={price}
              purchasePrice={purchasePrice}
              />
            )} */}

            <ProductPurchaseInfo />
            <span className=" text-gray-500">  
              Última actualización: {lastUpdate}
            </span>
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

            <ProductsCarousel
              products={filteredRelatedProducts}
              isAutoplay={false}
              loop={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
