"use client";

import { useRef, useEffect } from "react";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui"

// import { ProductCard } from "@/components";
import { useMediaQuery } from '@/hooks';
// import { products } from "@/mocks/products";
const products = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    image: "https://via.placeholder.com/150"
  }
]

interface ProductsCarouselProps {
  title: string;
  isAutoplay?: boolean;
}

export const ProductsCarousel = ({
  title,
  // href,
  isAutoplay = true,
  // withIndicators = false,
  // isProductPage = false,
  // products,
  // loop = false
}: ProductsCarouselProps) => {
  const isMobile = useMediaQuery("(max-width: 575px)");
  const isTablet = useMediaQuery("(min-width: 576px) and (max-width: 768px)");

  const mobileAutoPlay = useRef(Autoplay({ delay: 5000 }));
  const tabletAutoPlay = useRef(Autoplay({ delay: 6000 }));
  const desktopAutoPlay = useRef(Autoplay({ delay: 7000 }));

  const getAutoPlay = () => {
    if (isMobile) return mobileAutoPlay.current;
    if (isTablet) return tabletAutoPlay.current;
    return desktopAutoPlay.current;
  };

  useEffect(() => {
    if (isAutoplay) {
      getAutoPlay().reset();
    } else {
      getAutoPlay().stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isTablet, isAutoplay]);

  // const slidesSize = { base: "50%", xs: "33.333333%", sm: "25%", md: "20%" }
  // const slidesToScroll = { base: 2, xs: 3, sm: 4, md: 5 }
  // const slidesSizeProductPage = { base: "50%", md: "33.333333%" }
  // const slidesToScrollProductPage = { base: 2, md: 3 }

  return (
    <section className="w-11/12 max-width-screen mx-auto py-8">
      <div>
        <h2 className="font-heading text-2xl text-center mb-4">{title}</h2>

        {/* {href && <ViewAll href={href} />} */}
      </div>
      <div>
        {/*
          slideSize={isProductPage ? slidesSizeProductPage : slidesSize}
          slidesToScroll={isProductPage ? slidesToScrollProductPage : slidesToScroll}
        */}

        <Carousel
          className="w-full"
          opts={{
            loop: true,
            align: "start",
            slidesToScroll: 1,
            breakpoints: {
              '(min-width: 425px)': {
                slidesToScroll: 2
              },
              '(min-width: 640px)': {
                slidesToScroll: 3
              },
              '(min-width: 768px)': {
                slidesToScroll: 4
              },
              '(min-width: 1024px)': {
                slidesToScroll: 5
              }
            },
          }}

          onMouseEnter={() => isAutoplay && getAutoPlay().stop()}
          onMouseLeave={() => isAutoplay && getAutoPlay().play()}
          onTouchStart={() => isAutoplay && getAutoPlay().stop()}
          onTouchEnd={() => isAutoplay && getAutoPlay().play()}

          plugins={isAutoplay ? [getAutoPlay()] : []}
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-full xs:basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="w-full border rounded-md"> 
                  {/* <ProductCard product={product} classNames="border-none" /> */}
                  {product.name}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2 bg-white xl:-left-10" /> 
          <CarouselNext className="-right-2 bg-white xl:-right-10" />
        </Carousel>
      </div>
    </section>
  );
};
