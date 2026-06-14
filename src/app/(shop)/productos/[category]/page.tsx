import ProductsPage from "../productsPage";
import { ACCENT_CATEGORIES, formatSlugTitle } from "@/utils";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const title = ACCENT_CATEGORIES[category as keyof typeof ACCENT_CATEGORIES] ?? formatSlugTitle(category);

  return {
    title,
    description: "",
    keywords: [
      // TODO: Completar keywords y descripción
    ],
    alternates: { canonical: `/${category}` },
  };
}

export default async function ProductsCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  return <ProductsPage categorySlug={category} />;
}