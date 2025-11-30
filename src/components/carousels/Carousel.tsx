"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/libs/utils';

// TODO: Adaptar el contenido del carousel
const carouselItems = [
  {
    id: 1,
    title: "ACCESORIOS PREMIUM",
    subtitle: "PARA TU VEHÍCULO",
    description: "DESCUBRE NUESTRA NUEVA COLECCIÓN",
    buttonText: "COMPRAR AHORA",
    buttonLink: "#",
    bgColor: "bg-primary",
    textColor: "text-white",
    imageSrc: "/soluciones.png"
  },
  {
    id: 2,
    title: "MEGA OFERTAS",
    subtitle: "EN NEUMÁTICOS Y BATERÍAS",
    description: "HASTA 40% OFF Y 6 CUOTAS SIN INTERÉS",
    buttonText: "VER OFERTAS",
    buttonLink: "#",
    bgColor: "bg-secondary",
    textColor: "text-white",
    imageSrc: "/contanos-tu-experiencia.png"
  }
  // {
  //   id: 3,
  //   title: "HERRAMIENTAS PROFESIONALES",
  //   subtitle: "TODO PARA TU TALLER",
  //   description: "ENVÍO GRATIS EN COMPRAS SUPERIORES A $100",
  //   buttonText: "DESCUBRIR",
  //   buttonLink: "#",
  //   bgColor: "bg-neutral-900",
  //   textColor: "text-white",
  //   imageSrc: "https://images.unsplash.com/photo-1580402427914-a6cc60d7d03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDA2MjB8MHwxfHNlYXJjaHw3fHxtZWNoYW5pYyUyMHRvb2xzfGVufDB8fHx8MTcxNTEwMjUzOXww&ixlib=rb-4.0.3&q=80&w=1080"
  // }
];

export const Carousel = () => {
  // Crear array con slides duplicados: [último, ...originales, primero]
  const infiniteItems = [
    carouselItems[carouselItems.length - 1], // Último slide al inicio
    ...carouselItems,
    carouselItems[0] // Primer slide al final
  ];

  const totalSlides = infiniteItems.length;

  // Inicializar en el primer slide real (índice 1)
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Función para obtener el índice real (para los dots)
  const getRealIndex = (index: number) => {
    if (index === 0) return carouselItems.length - 1;
    if (index === totalSlides - 1) return 0;
    return index - 1;
  };

  // Auto scroll infinito - siempre hacia la derecha
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        
        // Si llegamos al último slide duplicado, saltar sin animación al primer slide real
        if (nextIndex >= totalSlides - 1) {
          // Saltar sin animación al primer slide real
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = 'none';
              setCurrentIndex(1);
              // Restaurar la transición después de un frame
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  if (carouselRef.current) {
                    carouselRef.current.style.transition = '';
                  }
                });
              });
            }
          }, 500);
          return nextIndex;
        }
        
        return nextIndex;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [totalSlides]);

  // Efecto para manejar el salto cuando llegamos a los slides duplicados
  useEffect(() => {
    if (!carouselRef.current) return;

    // Si estamos en el último slide duplicado (índice = length - 1), saltar al primero
    if (currentIndex === totalSlides - 1) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'none';
          setCurrentIndex(1);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (carouselRef.current) {
                carouselRef.current.style.transition = '';
              }
            });
          });
        }
      }, 500);
    }

    // Si estamos en el primer slide duplicado (índice = 0), saltar al último
    if (currentIndex === 0) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'none';
          setCurrentIndex(carouselItems.length);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (carouselRef.current) {
                carouselRef.current.style.transition = '';
              }
            });
          });
        }
      }, 500);
    }
  }, [currentIndex, totalSlides]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      
      // Si llegamos al último slide duplicado, saltar sin animación al primer slide real
      if (nextIndex >= totalSlides - 1) {
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = 'none';
            setCurrentIndex(1);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (carouselRef.current) {
                  carouselRef.current.style.transition = '';
                }
                setIsAnimating(false);
              });
            });
          }
        }, 500);
        return nextIndex;
      }
      
      setTimeout(() => setIsAnimating(false), 500);
      return nextIndex;
    });
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setCurrentIndex((prevIndex) => {
      const prevIndexValue = prevIndex - 1;
      
      // Si llegamos al primer slide duplicado, saltar sin animación al último slide real
      if (prevIndexValue <= 0) {
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = 'none';
            setCurrentIndex(carouselItems.length);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (carouselRef.current) {
                  carouselRef.current.style.transition = '';
                }
                setIsAnimating(false);
              });
            });
          }
        }, 500);
        return prevIndexValue;
      }
      
      setTimeout(() => setIsAnimating(false), 500);
      return prevIndexValue;
    });
  };

  const goToSlide = (realIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    // El índice real + 1 porque el primer slide real está en índice 1
    setCurrentIndex(realIndex + 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const realIndex = getRealIndex(currentIndex);

  return (
    <div className="relative overflow-hidden w-full h-[400px] md:h-[500px]">
      <div 
        ref={carouselRef}
        className="flex transition-transform duration-500 ease-in-out w-full h-full" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {infiniteItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className={`shrink-0 w-full h-full ${item.bgColor} relative`}
            style={{ minWidth: '100%' }}
          >
            <div className="absolute inset-0 z-0">
              <Image 
                src={item.imageSrc} 
                alt={item.title} 
                width={1200}
                height={600}
                className="w-full h-full object-cover opacity-50"
              />
            </div>
            <div className="relative z-10 container w-11/12 max-w-content mx-auto h-full flex flex-col justify-center items-center md:items-start text-center md:text-left">
              <h2 className={`text-3xl md:text-5xl font-subheading ${item.textColor} mb-2`}>{item.title}</h2>
              <h3 className={`text-xl md:text-3xl font-semibold ${item.textColor} mb-4`}>{item.subtitle}</h3>
              <p className={`text-lg md:text-xl ${item.textColor} mb-8 max-w-xl`}>{item.description}</p>
              <Button 
                className="bg-white text-accent hover:bg-gray-100 font-subheading text-sm px-8 py-6"
              >
                <a href={item.buttonLink}>{item.buttonText}</a>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              realIndex === index ? "bg-white" : "bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
