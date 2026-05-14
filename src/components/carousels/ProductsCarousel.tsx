"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui";
import { type CarouselApi } from "@/components/ui/carousel";

import { CarouselIndicators, ProductCard } from "@/components";
import { useMediaQuery } from "@/hooks";
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

export const ProductsCarousel = memo(
  ({
    title,
    href,
    isLoading,
    products = [],
    isAutoplay = true,
    withIndicators = false,
    loop = false,
  }: ProductsCarouselProps) => {

    const isMobile = useMediaQuery("(min-width: 375px)");
    const isTablet = useMediaQuery("(min-width: 620px) and (max-width: 768px)");
    const isSmallDesktop = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const [api, setApi] = useState<CarouselApi>();
    const [slidesPerView, setSlidesPerView] = useState(1);

    /* Plugins memoizados */
    const plugins = useMemo(() => {
      if (!isAutoplay) return [];
    
      return [
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
          breakpoints: {
            "(min-width: 375px)": {
              delay: 5000,
            },
            "(min-width: 620px)": {
              delay: 6000,
            },
            "(min-width: 1024px)": {
              delay: 7000,
            },
          },
        }),
      ];
    }, [isAutoplay]);

    /* Breakpoints memoizados */
    const breakpoints = useMemo(() => ({
      "(min-width: 375px)": { slidesToScroll: 2 },
      "(min-width: 620px)": { slidesToScroll: 3 },
      "(min-width: 768px)": { slidesToScroll: 4 },
      "(min-width: 1024px)": { slidesToScroll: 5 },
    }), []);

    /* Opciones memoizadas */
    const carouselOpts = useMemo(() => ({
      loop,
      align: "start" as const,
      slidesToScroll: 1,
      breakpoints,
    }), [loop, breakpoints]);

    /* Slides por viewport */  
    useEffect(() => {
      if (isDesktop) setSlidesPerView(5);
      else if (isSmallDesktop) setSlidesPerView(4);
      else if (isTablet) setSlidesPerView(3);
      else if (isMobile) setSlidesPerView(2);
      else setSlidesPerView(1);
    }, [isMobile, isTablet, isSmallDesktop, isDesktop]);

    /* Mouse handlers estables */
    const autoplay = api?.plugins()?.autoplay;

    const handleMouseEnter = useCallback(() => {
      if (!isAutoplay || !api) return;

      autoplay?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api, isAutoplay]);
    
    const handleMouseLeave = useCallback(() => {
      if (!isAutoplay || !api) return;

      autoplay?.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api, isAutoplay]);

    /* ✅ Indicadores calculados */
    const totalIndicators = useMemo(() => {
      return Math.ceil(products.length / slidesPerView);
    }, [products.length, slidesPerView]);

    if (products.length === 0) {
      return null;
    }

    if (isLoading) {
      return (
        <section className="w-11/12 max-w-content mx-auto py-8">
          {title && (
            <h2 className="font-heading text-2xl text-center mb-4">
              {title}
            </h2>
          )}

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
              {href ? (
                <Link
                  href={href}
                  className="w-full inline-flex items-center justify-center gap-2 text-foreground hover:text-primary transition-colors font-subheading text-2xl text-center group cursor-pointer md:w-fit md:text-3xl"
                >
                  {title}

                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    Ver todo
                  </span>
                </Link>
              ) : (
                title
              )}
            </h2>

            {withIndicators && (
              <CarouselIndicators
                api={api}
                totalIndicators={totalIndicators}
                isMobile={isMobile}
              />
            )}
          </div>
        )}

        <div>
          <Carousel
            className="w-full"
            setApi={setApi}
            opts={carouselOpts}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseEnter}
            onTouchEnd={handleMouseLeave}
            plugins={plugins}
          >
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="product-carousel-item"
                >
                  <div className="w-full border rounded-md bg-white">
                    <ProductCard
                      product={product}
                      classNames="border-none"
                    />
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
  }
);

ProductsCarousel.displayName = "ProductsCarousel";