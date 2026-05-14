import ProductsPage from "../../productsPage";
import { formatSlugTitle, ACCENT_SUBCATEGORIES } from "@/utils";

export async function generateMetadata({ params }: { params: Promise<{ category: string; subcategory: string }> }) {
  const { subcategory } = await params;

  const title = ACCENT_SUBCATEGORIES[subcategory as keyof typeof ACCENT_SUBCATEGORIES] ?? formatSlugTitle(subcategory);

  return {
    title,
    description: "",
  };
}

export default async function ProductsSubcategoryPage({ params }: { params: Promise<{ category: string; subcategory: string }> }) {
  const { category, subcategory } = await params;

  return <ProductsPage categorySlug={category} subcategorySlug={subcategory} />;
}
