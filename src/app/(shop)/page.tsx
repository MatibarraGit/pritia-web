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

export const metadata = { 
  title: "Pritia - Tienda Online" ,
  description: "Vení a descrubrir los más de 600 productos que tenemos para vos!"
};

export default async function HomePage() {
  let DailyHighlightsProducts: ProductType[] = [];
  let NewEntriesProducts: ProductType[] = [];
  let ProductsOnOffer: ProductType[] = [];
  let ReEntriesProducts: ProductType[] = [];
  // let BestSellersProducts: ProductType[] = [];
  let NewsProducts: ProductType[] = [];
  let isLoading = true;

  try {
    const { dailyHighlightsProducts, newEntriesProducts, productsOnOffer, reEntriesProducts, newsProducts } = await getHomeProducts(); // bestSellersProducts,
    DailyHighlightsProducts = dailyHighlightsProducts;
    NewEntriesProducts = newEntriesProducts;
    ProductsOnOffer = productsOnOffer;
    ReEntriesProducts = reEntriesProducts;
    // BestSellersProducts = bestSellersProducts;
    NewsProducts = newsProducts;
  } catch {
    DailyHighlightsProducts = [];
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
      <DailyHighlights products={DailyHighlightsProducts} />
      <ProductsCarousel title="Nuevos Productos" href={newProductsUrl} isLoading={isLoading} products={NewEntriesProducts} isAutoplay withIndicators loop />
      <ProductsCarousel title="Mejores Ofertas" href={offersUrl} isLoading={isLoading} products={ProductsOnOffer} isAutoplay withIndicators loop />
      <ProductCategories />
      <ProductsCarousel title="Reingresos" href={reEntriesUrl} isLoading={isLoading} products={ReEntriesProducts} isAutoplay withIndicators loop />
      <ProductsCarousel title="Novedades" href={newsProductsUrl} isLoading={isLoading} products={NewsProducts} isAutoplay withIndicators loop />
      <ServicesHighlight />
    </>
  );
}
