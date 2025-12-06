import {
  Carousel,
  // FeaturedFans,
  DailyHighlights,
  ProductsCarousel,
  ProductCategories,
  ServicesHighlight,
} from "@/components";
import { getHomeProducts } from "@/services";
import { ProductType } from "@/types";

export default async function Page() {
  let BestSellersProducts: ProductType[] = [];
  let ProductsOnOffer: ProductType[] = [];
  let NewEntriesProducts: ProductType[] = [];
  let isLoading = true;

  try {
    const { bestSellersProducts, productsOnOffer, newEntriesProducts } = await getHomeProducts();
    BestSellersProducts = bestSellersProducts;
    ProductsOnOffer = productsOnOffer;
    NewEntriesProducts = newEntriesProducts;
  } catch {
    BestSellersProducts = [];
    ProductsOnOffer = [];
    NewEntriesProducts = [];
  } finally {
    isLoading = false;
  }

  return (
    <>
      <Carousel />
      {/* <FeaturedFans /> */}
      <DailyHighlights products={ProductsOnOffer.slice(0, 3)} />
      <ProductsCarousel title="Nuevos Productos" products={NewEntriesProducts} isLoading={isLoading} />
      <ProductsCarousel title="Más Vendidos" products={BestSellersProducts} isLoading={isLoading} />
      <ProductCategories />
      <ProductsCarousel title="Mejores Ofertas" products={ProductsOnOffer} isLoading={isLoading} />
      <ServicesHighlight />
    </>
  );
}
