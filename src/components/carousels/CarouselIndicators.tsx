"use client";

import { useEffect, useState, useCallback, memo } from "react";

import { type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/libs/utils";

interface CarouselIndicatorsProps {
  api?: CarouselApi;
  totalIndicators: number;
  isMobile?: boolean;
}

/**
 * ✅ Componente separado
 * Solo esto se re-renderiza cuando cambia el slide
 */
export const CarouselIndicators = memo(
  ({ api, totalIndicators, isMobile }: CarouselIndicatorsProps) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
      if (!api) return;

      const onSelect = () => {
        setCurrent(api.selectedScrollSnap());
      };

      onSelect();

      api.on("select", onSelect);

      return () => {
        api.off("select", onSelect);
      };
    }, [api]);

    const goToSlide = useCallback(
      (index: number) => {
        api?.scrollTo(index);
      },
      [api]
    );

    if (totalIndicators <= 1) return null;

    return (
      <div
        className={cn(
          "w-70 mx-auto space-y-0.5 flex items-center justify-center gap-1.5 flex-wrap absolute -bottom-1 left-0 right-0 md:justify-end md:gap-2 md:relative md:bottom-auto md:left-auto",
          isMobile && "bottom-1"
        )}
      >
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
    );
  }
);

CarouselIndicators.displayName = "CarouselIndicators";