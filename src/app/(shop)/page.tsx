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

export default async function HomePage() {
  let NewEntriesProducts: ProductType[] = [];
  let ProductsOnOffer: ProductType[] = [];
  let ReEntriesProducts: ProductType[] = [];
  // let BestSellersProducts: ProductType[] = [];
  let NewsProducts: ProductType[] = [];
  let isLoading = true;

  try {
    const { newEntriesProducts, productsOnOffer, reEntriesProducts, newsProducts } = await getHomeProducts(); // bestSellersProducts,
    NewEntriesProducts = newEntriesProducts;
    ProductsOnOffer = productsOnOffer;
    ReEntriesProducts = reEntriesProducts;
    // BestSellersProducts = bestSellersProducts;
    NewsProducts = newsProducts;
  } catch {
    NewEntriesProducts = [];
    ProductsOnOffer = [];
    ReEntriesProducts = [];
    // BestSellersProducts = [];
    NewsProducts = [];
  } finally {
    isLoading = false;
  }

  const newProductsUrl = `/products?topic=${encodeURIComponent(TOPICS.NEW_ENTRIES)}`;
  const offersUrl = `/products?topic=${encodeURIComponent(TOPICS.OFFERS)}`;
  // const bestSellersUrl = `/products?topic=${encodeURIComponent(TOPICS.BEST_SELLERS)}`;
  const reEntriesUrl = `/products?topic=${encodeURIComponent(TOPICS.RE_ENTRIES)}`;
  const newsProductsUrl = `/products?topic=${encodeURIComponent(TOPICS.NEWS)}`;

  return (
    <>
      <Carousel />
      {/* <FeaturedFans /> */}
      <DailyHighlights products={ProductsOnOffer.slice(0, 3)} />
      <ProductsCarousel title="Nuevos Productos" href={newProductsUrl} isLoading={isLoading} products={NewEntriesProducts} isAutoplay withIndicators loop />
      <ProductsCarousel title="Mejores Ofertas" href={offersUrl} isLoading={isLoading} products={ProductsOnOffer} isAutoplay withIndicators loop />
      <ProductCategories />
      <ProductsCarousel title="Reingresos" href={reEntriesUrl} isLoading={isLoading} products={ReEntriesProducts} isAutoplay withIndicators loop />
      <ProductsCarousel title="Novedades" href={newsProductsUrl} isLoading={isLoading} products={NewsProducts} isAutoplay withIndicators loop />
      <ServicesHighlight />
    </>
  );
}
