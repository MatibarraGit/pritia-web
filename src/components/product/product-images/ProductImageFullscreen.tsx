"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useEmblaSelectedIndex } from "./useEmblaSelectedIndex";
import { useTouchImageZoom } from "./useTouchImageZoom";

interface ProductImageFullscreenProps {
  images: string[];
  name: string;
  initialIndex: number;
  open: boolean;
  onClose: (index: number) => void;
}

interface ZoomableProductImageProps {
  src: string;
  alt: string;
  priority: boolean;
}

function ZoomableProductImage({
  src,
  alt,
  priority,
}: ZoomableProductImageProps) {
  const { containerRef, imageStyle, touchHandlers } = useTouchImageZoom();

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ touchAction: "none" }}
      {...touchHandlers}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-contain"
        style={imageStyle}
      />
    </div>
  );
}

export function ProductImageFullscreen({
  images,
  name,
  initialIndex,
  open,
  onClose,
}: ProductImageFullscreenProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: images.length > 1,
    startIndex: initialIndex,
  });
  const selectedIndex = useEmblaSelectedIndex(emblaApi, initialIndex);
  const hasMultipleImages = images.length > 1;

  const handleClose = () => {
    onClose(selectedIndex);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-black p-0 shadow-none"
      >
        <DialogTitle className="sr-only">Imagen del producto</DialogTitle>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-20 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
          onClick={handleClose}
          aria-label="Cerrar imagen"
        >
          <X className="size-5" />
        </Button>

        {hasMultipleImages && (
          <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative min-w-0 shrink-0 grow-0 basis-full"
              >
                <ZoomableProductImage
                  src={image}
                  alt={`${name} - vista ${index + 1}`}
                  priority={index === initialIndex}
                />
              </div>
            ))}
          </div>
        </div>

        {hasMultipleImages && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Ver imagen anterior"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Ver imagen siguiente"
            >
              <ChevronRight className="size-6" />
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
