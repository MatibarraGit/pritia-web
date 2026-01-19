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

export const metadata = { title: "Pritia - Tienda Online" };

export default async function Page() {
  let NewEntriesProducts: ProductType[] = [];
  let ProductsOnOffer: ProductType[] = [];
  // let BestSellersProducts: ProductType[] = [];
  let NewsProducts: ProductType[] = [];
  let isLoading = true;

  try {
    const { 
      newEntriesProducts,
      productsOnOffer, 
      // bestSellersProducts, 
      newsProducts
    } = await getHomeProducts();
    NewEntriesProducts = newEntriesProducts;
    ProductsOnOffer = productsOnOffer;
    // BestSellersProducts = bestSellersProducts;
    NewsProducts = newsProducts;
  } catch {
    NewEntriesProducts = [];
    ProductsOnOffer = [];
    // BestSellersProducts = [];
    NewsProducts = [];
  } finally {
    isLoading = false;
  }

  const newProductsUrl = `/products?topic=${encodeURIComponent(TOPICS.NEW_ENTRIES)}`;
  const offersUrl = `/products?topic=${encodeURIComponent(TOPICS.OFFERS)}`;
  // const bestSellersUrl = `/products?topic=${encodeURIComponent(TOPICS.BEST_SELLERS)}`;
  const newsProductsUrl = `/products?topic=${encodeURIComponent(TOPICS.NEWS)}`;

  return (
    <>
      <Carousel />
      {/* <FeaturedFans /> */}
      <DailyHighlights products={ProductsOnOffer.slice(0, 3)} />
      <ProductsCarousel title="Nuevos Productos" href={newProductsUrl} isLoading={isLoading} products={NewEntriesProducts} isAutoplay withIndicators loop />
      <ProductsCarousel title="Mejores Ofertas" href={offersUrl} isLoading={isLoading} products={ProductsOnOffer} isAutoplay withIndicators loop />
      <ProductCategories />
      <ProductsCarousel title="Novedades" href={newsProductsUrl} isLoading={isLoading} products={NewsProducts} isAutoplay withIndicators loop />
      <ServicesHighlight />
    </>
  );
}
