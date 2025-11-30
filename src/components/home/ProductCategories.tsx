"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui";

import { cn } from '@/libs/utils';
import { useFetchData, useMediaQuery } from '@/hooks';
import { CategoryType } from "@/types";

const fetchCategories = async (): Promise<CategoryType[] | null> => {
  const response = await fetch("/api/categories");
  const data = await response.json();
  return data || [];
}

export const ProductCategories = () => {
  const { data: categories, isLoading } = useFetchData<CategoryType[]>({ fetchFunction: fetchCategories });

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
    getAutoPlay().reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isTablet]);

  if (isLoading) {
    return (
      <section className="w-11/12 max-w-content py-8 mx-auto">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">Cargando categorías...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }
  
  return (
    <section className="w-11/12 max-w-content py-8 mx-auto">
      <div className="container mx-auto">
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
              },
              '(min-width: 1280px)': {
                slidesToScroll: 6
              }
            },
          }}
          onMouseEnter={() => getAutoPlay().stop()}
          onMouseLeave={() => getAutoPlay().play()}
          onTouchStart={() => getAutoPlay().stop()}
          onTouchEnd={() => getAutoPlay().play()}
          plugins={[getAutoPlay()]}
        >
          <CarouselContent>
            {categories.map((category) => (
              <CarouselItem key={category.category_id} className="basis-full xs:basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                <Link
                  href={`/products?category=${category.category_name}`}
                  className={cn(
                    "group relative overflow-hidden rounded-lg shadow-md transition-transform hover:transform hover:scale-105 bg-linear-to-br from-primary/20 to-secondary/20 block"
                  )}
                >
                  <div className="aspect-square w-full flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <div className="relative z-10 text-center">
                      <p className="font-medium text-white text-lg">{category.category_name}</p>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <p className="text-white/80 text-xs mt-1">
                          {category.subcategories.length} {category.subcategories.length === 1 ? 'subcategoría' : 'subcategorías'}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
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