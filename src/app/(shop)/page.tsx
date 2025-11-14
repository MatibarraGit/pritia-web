import {
  Carousel,
  ProductsCarousel,
} from "@/components";

export default function Home() {
  return (
    <>
      <Carousel />
      <ProductsCarousel title="Más Vendidos"/>
      <ProductsCarousel title="Mejores Ofertas"/>
    </>
  );
}
