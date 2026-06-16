"use client";

import { useCallback, useSyncExternalStore } from "react";

import { type CarouselApi } from "@/components/ui/carousel";

export function useEmblaSelectedIndex(
  api: CarouselApi,
  fallbackIndex = 0
) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!api) return () => undefined;

      api.on("select", onStoreChange);
      api.on("reInit", onStoreChange);

      return () => {
        api.off("select", onStoreChange);
        api.off("reInit", onStoreChange);
      };
    },
    [api]
  );

  const getSnapshot = useCallback(() => {
    return api?.selectedScrollSnap() ?? fallbackIndex;
  }, [api, fallbackIndex]);

  const getServerSnapshot = useCallback(() => fallbackIndex, [fallbackIndex]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
