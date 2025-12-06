"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/libs/utils";
import Image from "next/image";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonHref: string;
  buttonText: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "TODO PARA TU HOGAR",
    subtitle: "MÁS DE 500 PRODUCTOS",
    description: "Electrodomésticos, muebles, decoración y más",
    buttonHref: "/products",
    buttonText: "VER PRODUCTOS",
    image: "/img/slide-home-products.png",
  },
  {
    id: 2,
    title: "MEGA OFERTAS",
    subtitle: "PENSADAS PARA VOS",
    description: "HASTA 35% OFF y cuotas sin tarjeta",
    buttonHref: "/products?topic=ofertas",
    buttonText: "VER OFERTAS",
    image: "/img/slide-offers.png",
  },
  {
    id: 3,
    title: "ENVÍOS A TODO EL PAÍS",
    subtitle: "LLEGAMOS A TU PUERTA",
    description: "Entregas rápidas y seguras",
    buttonHref: "/help",
    buttonText: "VER MÁS",
    image: "/img/slide-shipping.png",
  },
];

export const Carousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  const nextSlide = () => {
    api?.scrollNext();
  };

  const prevSlide = () => {
    api?.scrollPrev();
  };

  return (
    <section className="relative w-full overflow-hidden">
      <ShadcnCarousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[autoplay.current]}
        className="w-full h-[500px] bg-primary md:h-96"
        onMouseEnter={() => autoplay.current.stop()}
        onMouseLeave={() => autoplay.current.play()}
        onTouchStart={() => autoplay.current.stop()}
        onTouchEnd={() => autoplay.current.play()}
      >
        <CarouselContent className="m-auto">
          {slides.map((item) => (
            <CarouselItem key={item.id} className="m-auto basis-full pl-0">
              <div className="py-4 my-auto relative">
                <div className="w-11/12 max-w-6xl h-[440px] mx-auto flex flex-col text-white md:h-80 md:flex-row md:gap-12 md:items-center">
                  {/* Text Content */}
                  <div className="flex-1 text-center md:text-left order-1">
                    <h1 className="text-3xl md:text-5xl font-bold text-carousel-text mb-2">
                      {item.title}
                    </h1>
                    <h2 className="text-xl md:text-3xl font-semibold text-carousel-text mb-4">
                      {item.subtitle}
                    </h2>
                    <p className="text-carousel-text/90 text-base md:text-lg mb-6">
                      {item.description}
                    </p>
                    <Button
                      variant="secondary"
                      size="lg"
                      href={item.buttonHref}
                      className="w-fit self-center mt-auto font-semibold tracking-wide bg-white text-primary hover:bg-gray-100"
                    >
                      {item.buttonText}
                    </Button>
                  </div>

                  {/* Image - Always at the end (order-2) */}
                  <div className="w-fit mx-auto flex-1 flex items-end order-2 max-h-[200px] md:w-full md:mt-0 md:items-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={400}
                      className="w-full max-w-lg max-h-[200px] mx-auto rounded-lg object-contain md:max-h-none"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-carousel-text/10 hover:bg-carousel-text/20 transition-colors backdrop-blur-sm text-white"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6 text-carousel-text" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-carousel-text/10 hover:bg-carousel-text/20 transition-colors backdrop-blur-sm text-white"
          aria-label="Siguiente slide"
        >
          <ChevronRight className="w-6 h-6 text-carousel-text" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === current
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-carousel-text/70"
              )}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </ShadcnCarousel>
    </section>
  );
};
