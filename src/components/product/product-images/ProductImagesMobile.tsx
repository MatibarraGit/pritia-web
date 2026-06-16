"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

import { useEmblaSelectedIndex } from "./useEmblaSelectedIndex";
import { ProductImageFullscreen } from "./ProductImageFullscreen";

interface ProductImagesMobileProps {
  images: string[];
  name: string;
}

interface PointerStart {
  x: number;
  y: number;
  time: number;
  index: number;
}

const TAP_DISTANCE_LIMIT = 8;
const TAP_TIME_LIMIT = 280;

export function ProductImagesMobile({ images, name }: ProductImagesMobileProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: images.length > 1,
  });
  const selectedIndex = useEmblaSelectedIndex(emblaApi);
  const pointerStartRef = useRef<PointerStart | null>(null);
  const [fullscreenStartIndex, setFullscreenStartIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const openFullscreen = useCallback((index: number) => {
    setFullscreenStartIndex(index);
    setFullscreenOpen(true);
  }, []);

  const handleFullscreenClose = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index, true);
      setFullscreenOpen(false);
    },
    [emblaApi]
  );

  const handlePointerDown = useCallback(
    (index: number, event: React.PointerEvent<HTMLButtonElement>) => {
      if (!event.isPrimary) return;

      pointerStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        time: Date.now(),
        index,
      };
    },
    []
  );

  const handlePointerUp = useCallback(
    (index: number, event: React.PointerEvent<HTMLButtonElement>) => {
      const pointerStart = pointerStartRef.current;
      pointerStartRef.current = null;

      if (!pointerStart || pointerStart.index !== index) return;

      const distance = Math.hypot(
        event.clientX - pointerStart.x,
        event.clientY - pointerStart.y
      );
      const duration = Date.now() - pointerStart.time;

      if (distance <= TAP_DISTANCE_LIMIT && duration <= TAP_TIME_LIMIT) {
        openFullscreen(index);
      }
    },
    [openFullscreen]
  );

  return (
    <div className="md:hidden">
      <div className="relative overflow-hidden rounded-lg bg-white">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className="relative aspect-square min-w-0 shrink-0 grow-0 basis-full cursor-zoom-in bg-white"
                onPointerDown={(event) => handlePointerDown(index, event)}
                onPointerUp={(event) => handlePointerUp(index, event)}
                onPointerCancel={() => {
                  pointerStartRef.current = null;
                }}
                aria-label={`Abrir imagen ${index + 1} de ${images.length}`}
              >
                <Image
                  src={image}
                  alt={`${name} - vista ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority={index === 0}
                />
              </button>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {fullscreenOpen && (
        <ProductImageFullscreen
          images={images}
          name={name}
          initialIndex={fullscreenStartIndex}
          open={fullscreenOpen}
          onClose={handleFullscreenClose}
        />
      )}
    </div>
  );
}
