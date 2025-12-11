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

import { ProductCard } from "@/components";
import { useMediaQuery } from '@/hooks';
import { ProductType } from "@/types";
import Link from "next/link";

interface ProductsCarouselProps {
  title?: string;
  href?: string;
  isLoading?: boolean;
  products: ProductType[];
  isAutoplay?: boolean;
  withIndicators?: boolean;
  loop: boolean;
}

export const ProductsCarousel = ({
  title,
  href,
  isLoading,
  products = [],
  // isProductPage = false,
  isAutoplay = true,
  withIndicators = false,
  loop = false
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

  const slides = [1,2,3,4,5]

  if (products.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="w-11/12 max-w-content mx-auto py-8">
        {title && <h2 className="font-heading text-2xl text-center mb-4">{title}</h2>}
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Cargando productos...</p>
        </div>
    </section>
    );
  }

  return (
    <section className="w-11/12 max-w-content mx-auto py-8 relative">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="w-full mb-4">
            {href ? 
              <Link href={href} className="w-full inline-flex items-center justify-center gap-2 text-foreground hover:text-primary transition-colors font-heading text-2xl text-center group cursor-pointer md:w-fit md:text-3xl" 
              >
                {title}
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary group-hover:bg-primary 
                group-hover:text-white transition-colors">
                  Ver todo
                </span>
              </Link>
            : 
              title
            }
          </h2>

          {withIndicators && (
            <div 
            className="flex gap-2 absolute bottom-2 left-1/2 -translate-x-1/2 z-20 md:relative md:left-0 md:translate-x-0 md:z-0"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                // onClick={() => goToSlide(index)}
                // className={cn(
                //   "w-3 h-3 rounded-full transition-all duration-300",
                //   index === current
                //     ? "bg-white w-8"
                //     : "bg-white/50 hover:bg-carousel-text/70"
                // )}
                className="w-2 h-2 rounded-full transition-all duration-300 bg-red-500"
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
          )}
        </div>
      )}
      <div>
        <Carousel
          className="w-full"
          opts={{
            loop: loop,
            align: "start",
            slidesToScroll: 1,
            breakpoints: {
              '(min-width: 375px)': {
                slidesToScroll: 2,
              },
              '(min-width: 620px)': {
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
          <CarouselContent className="">
            {products.map((product) => (
              <CarouselItem key={product.id} className="product-carousel-item">
                <div className="w-full border rounded-md bg-white"> 
                  <ProductCard product={product} classNames="border-none " />
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
