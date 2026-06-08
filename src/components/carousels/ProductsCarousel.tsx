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
    const [api, setApi] = useState<CarouselApi>();
    const [totalIndicators, setTotalIndicators] = useState(0);

    const isTouchViewport = useMediaQuery("(max-width: 767px)");
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const canAutoplay = isAutoplay && !isTouchViewport && !prefersReducedMotion;

    const plugins = useMemo(() => {
      if (!canAutoplay) return [];

      return [
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
          breakpoints: {
            "(min-width: 620px)": {
              delay: 6000,
            },
            "(min-width: 1024px)": {
              delay: 7000,
            },
          },
        }),
      ];
    }, [canAutoplay]);

    const breakpoints = useMemo(() => ({
      "(min-width: 620px)": { slidesToScroll: 2 },
      "(min-width: 768px)": { slidesToScroll: 3 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
    }), []);

    const carouselOpts = useMemo(() => ({
      loop,
      align: "start" as const,
      slidesToScroll: 1,
      duration: isTouchViewport ? 20 : 30,
      breakpoints,
    }), [loop, isTouchViewport, breakpoints]);

    useEffect(() => {
      if (!api) return;

      const updateSnapCount = () => {
        setTotalIndicators(api.scrollSnapList().length);
      };

      updateSnapCount();
      api.on("reInit", updateSnapCount);

      return () => {
        api.off("reInit", updateSnapCount);
      };
    }, [api, products.length]);

    const autoplay = api?.plugins()?.autoplay;

    const handleMouseEnter = useCallback(() => {
      if (!canAutoplay || !api) return;

      autoplay?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api, canAutoplay]);

    const handleMouseLeave = useCallback(() => {
      if (!canAutoplay || !api) return;

      autoplay?.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api, canAutoplay]);

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
      <section className="w-11/12 max-w-content mx-auto py-4 relative">
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

            {withIndicators && !isTouchViewport && (
              <CarouselIndicators
                api={api}
                totalIndicators={totalIndicators}
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
            plugins={plugins}
          >
            <CarouselContent
              className="will-change-transform transform-gpu"
            >
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="product-carousel-item"
                >
                  <div className="w-full border rounded-md bg-white">
                    <ProductCard
                      product={product}
                      classNames="border-none"
                      imageSizes="(max-width: 374px) 92vw, (max-width: 619px) 46vw, (max-width: 767px) 30vw, (max-width: 1023px) 23vw, 18vw"
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
