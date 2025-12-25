"use client";

import { useRef, useEffect, useState } from "react";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui"
import { type CarouselApi } from "@/components/ui/carousel";

import { ProductCard } from "@/components";
import { useMediaQuery } from '@/hooks';
import { ProductType } from "@/types";
import Link from "next/link";
import { cn } from "@/libs/utils";

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

  const isMobile = useMediaQuery("(min-width: 375px)");
  const isTablet = useMediaQuery("(min-width: 620px) and (max-width: 768px)");
  const isSmallDesktop = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  const mobileAutoPlay = useRef(Autoplay({ delay: 5000 }));
  const tabletAutoPlay = useRef(Autoplay({ delay: 6000 }));
  const desktopAutoPlay = useRef(Autoplay({ delay: 7000 }));

  const getAutoPlay = () => {
    if (isMobile) return mobileAutoPlay.current;
    if (isTablet) return tabletAutoPlay.current;
    return desktopAutoPlay.current;
  };

  // Calcular slides por vista según breakpoint
  useEffect(() => {
    if (isDesktop) {
      setSlidesPerView(5);
    } else if (isSmallDesktop) {
      setSlidesPerView(4);
    } else if (isTablet) {
      setSlidesPerView(3);
    } else if (isMobile) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(1);
    }
  }, [isMobile, isTablet, isSmallDesktop, isDesktop]);

  // Calcular número de indicadores basado en slides por vista
  const totalIndicators = Math.ceil(products.length / slidesPerView);

  // Sincronizar el slide actual con la API del carousel
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("select", () => {});
    };
  }, [api]);

  useEffect(() => {
    if (isAutoplay) {
      getAutoPlay().reset();
    } else {
      getAutoPlay().stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isTablet, isAutoplay]);

  const breakpoints = {
    '(min-width: 375px)': {
      slidesToScroll: 2,
    },
    '(min-width: 620px)': {
      slidesToScroll: 3,
    },
    '(min-width: 768px)': {
      slidesToScroll: 4,
    },
    '(min-width: 1024px)': {
      slidesToScroll: 5,
    }
  };

  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

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
              <Link href={href} className="w-full inline-flex items-center justify-center gap-2 text-foreground hover:text-primary transition-colors font-subheading text-2xl text-center group cursor-pointer md:w-fit md:text-3xl" 
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

          {withIndicators && totalIndicators > 1 && (
            <div className={cn(
              "w-70 mx-auto space-y-0.5 flex items-center justify-center gap-1.5 flex-wrap absolute -bottom-1 left-0 right-0 md:justify-end md:gap-2 md:relative md:bottom-auto md:left-auto",
              isMobile && "bottom-1"
            )}>
              {Array.from({ length: totalIndicators }).map((_, index) => {
                const isActive = Math.floor(current) === index;
                return (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      isActive
                        ? "w-3 h-2 md:w-6 md:h-2.5 bg-primary"
                        : "w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-300 hover:bg-gray-400"
                    )}
                    aria-label={`Ir al grupo ${index + 1} de ${totalIndicators}`}
                    aria-current={isActive ? "true" : "false"}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      <div>
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{
            loop: loop,
            align: "start",
            slidesToScroll: 1,
            breakpoints,
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
