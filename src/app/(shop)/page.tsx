import {
  Carousel,
  FeaturedFans,
  DailyHighlights,
  ProductsCarousel,
  ProductCategories,
  ServicesHighlight,
  PaymentMethods,
} from "@/components";

export default function Page() {
  return (
    <>
      <Carousel />
      <FeaturedFans />
      <DailyHighlights />
      <ProductsCarousel title="Más Vendidos"/>
      <ProductCategories />
      <ProductsCarousel title="Mejores Ofertas"/>
      <ServicesHighlight />
      <PaymentMethods />
    </>
  );
}
