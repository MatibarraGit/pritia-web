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
import { TOPICS } from "@/utils";

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

  const newProductsUrl = `/products?topic=${encodeURIComponent(TOPICS.NEW_ENTRIES)}`;
  const bestSellersUrl = `/products?topic=${encodeURIComponent(TOPICS.BEST_SELLERS)}`;
  const offersUrl = `/products?topic=${encodeURIComponent(TOPICS.OFFERS)}`;

  return (
    <>
      <Carousel />
      {/* <FeaturedFans /> */}
      <DailyHighlights products={ProductsOnOffer.slice(0, 3)} />
      <ProductsCarousel title="Nuevos Productos" href={newProductsUrl} isLoading={isLoading} products={NewEntriesProducts} isAutoplay withIndicators loop />
      <ProductsCarousel title="Más Vendidos" href={bestSellersUrl} isLoading={isLoading} products={BestSellersProducts} isAutoplay withIndicators loop />
      <ProductCategories />
      <ProductsCarousel title="Mejores Ofertas" href={offersUrl} isLoading={isLoading} products={ProductsOnOffer} isAutoplay withIndicators loop />
      <ServicesHighlight />
    </>
  );
}
