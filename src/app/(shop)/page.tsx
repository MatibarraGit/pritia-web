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
import Image from "next/image";
import Link from "next/link";

export const metadata = { 
  title: "Pritia - Tienda Online" ,
  description: "Vení a descrubrir los más de 600 productos que tenemos para vos!"
};

// TODO: Volver a offersProductsUrl al finalizar HotSale

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

  const hotSaleProductsUrl = `/hotsale`;
  const newProductsUrl = `/productos?seccion=${encodeURIComponent(TOPICS.NEW_ENTRIES)}`;
  // const offersUrl = `/productos?seccion=${encodeURIComponent(TOPICS.OFFERS)}`;
  // const bestSellersUrl = `/productos?seccion=${encodeURIComponent(TOPICS.BEST_SELLERS)}`;
  const reEntriesUrl = `/productos?seccion=${encodeURIComponent(TOPICS.RE_ENTRIES)}`;
  const newsProductsUrl = `/productos?seccion=${encodeURIComponent(TOPICS.NEWS)}`;

  return (
    <>
      <Carousel />

      <Link href="/hotsale">
        <Image src="/img/banner-campaña-hotsale2.png" alt="Hot Sale" width={1600} height={500} className="w-11/12 max-w-content my-6 mx-auto rounded-lg object-cover" />
      </Link>

      {/* <FeaturedFans /> */}
      <DailyHighlights products={DailyHighlightsProducts} />
      <ProductsCarousel title="Hot Sale 🔥" href={hotSaleProductsUrl} isLoading={isLoading} products={ProductsOnOffer} isAutoplay withIndicators loop />
      <ProductsCarousel title="Nuevos Productos" href={newProductsUrl} isLoading={isLoading} products={NewEntriesProducts} isAutoplay withIndicators loop />
      {/* <ProductsCarousel title="Ofertas" href={offersUrl} isLoading={isLoading} products={ProductsOnOffer} isAutoplay withIndicators loop /> */}
      <ProductCategories />
      <ProductsCarousel title="Reingresos" href={reEntriesUrl} isLoading={isLoading} products={ReEntriesProducts} isAutoplay withIndicators loop />
      <ProductsCarousel title="Novedades" href={newsProductsUrl} isLoading={isLoading} products={NewsProducts} isAutoplay withIndicators loop />
      <ServicesHighlight />
    </>
  );
}
