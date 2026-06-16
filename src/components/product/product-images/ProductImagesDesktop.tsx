"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/libs/utils";

const ZOOM_SCALE = 2.5;
const LENS_SIZE = 144;

interface ZoomState {
  xPercent: number;
  yPercent: number;
  lensX: number;
  lensY: number;
  lensSize: number;
}

interface ProductImagesDesktopProps {
  images: string[];
  name: string;
  selectedImage: number;
  onSelectImage: (index: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ProductImagesDesktop({
  images,
  name,
  selectedImage,
  onSelectImage,
}: ProductImagesDesktopProps) {
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const [zoomState, setZoomState] = useState<ZoomState | null>(null);
  const currentImage = images[selectedImage] ?? images[0];

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;

      const frame = imageFrameRef.current;

      if (!frame) return;

      const rect = frame.getBoundingClientRect();
      const pointerX = clamp(event.clientX - rect.left, 0, rect.width);
      const pointerY = clamp(event.clientY - rect.top, 0, rect.height);
      const lensSize = Math.min(LENS_SIZE, rect.width * 0.55, rect.height * 0.55);

      setZoomState({
        xPercent: (pointerX / rect.width) * 100,
        yPercent: (pointerY / rect.height) * 100,
        lensX: clamp(pointerX - lensSize / 2, 0, rect.width - lensSize),
        lensY: clamp(pointerY - lensSize / 2, 0, rect.height - lensSize),
        lensSize,
      });
    },
    []
  );

  return (
    <div className="relative hidden gap-4 md:flex">
      {images.length > 1 && (
        <div className="flex max-h-[600px] w-20 shrink-0 flex-col gap-2 overflow-y-auto pr-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={cn(
                "relative aspect-square w-16 cursor-pointer overflow-hidden rounded-md border bg-white transition-all hover:border-primary/50",
                selectedImage === index &&
                  "border-primary ring-2 ring-primary/40"
              )}
              onClick={() => onSelectImage(index)}
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
              aria-current={selectedImage === index}
            >
              <Image
                src={image}
                alt={`${name} - vista ${index + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative min-w-0 flex-1">
        <div
          ref={imageFrameRef}
          className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-white"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setZoomState(null)}
        >
          <Image
            src={currentImage}
            alt={name}
            fill
            sizes="(min-width: 1024px) 45vw, 50vw"
            className="object-contain"
            priority
          />

          {zoomState && (
            <div
              className="pointer-events-none absolute border bg-black/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.10)]"
              style={{
                width: zoomState.lensSize,
                height: zoomState.lensSize,
                left: zoomState.lensX,
                top: zoomState.lensY,
              }}
            />
          )}
        </div>

        {zoomState && (
          <div
            className="absolute left-[calc(100%+1rem)] top-0 z-30 hidden aspect-square w-[520px] max-w-[42vw] overflow-hidden rounded-lg border bg-white shadow-xl md:block"
            aria-hidden="true"
            style={{
              backgroundImage: `url("${currentImage}")`,
              backgroundPosition: `${zoomState.xPercent}% ${zoomState.yPercent}%`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${ZOOM_SCALE * 100}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}
