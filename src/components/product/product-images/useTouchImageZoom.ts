"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import type { CSSProperties, TouchEvent } from "react";

const MIN_SCALE = 1;
const DOUBLE_TAP_SCALE = 2;
const MAX_SCALE = 4;
const TAP_DISTANCE_LIMIT = 8;
const DOUBLE_TAP_DELAY = 300;

interface ZoomTransform {
  scale: number;
  x: number;
  y: number;
}

type GestureState =
  | { type: "none" }
  | {
      type: "pan";
      startClientX: number;
      startClientY: number;
      startX: number;
      startY: number;
      moved: boolean;
    }
  | {
      type: "pinch";
      startDistance: number;
      startScale: number;
    };

interface TapStart {
  x: number;
  y: number;
  time: number;
}

type ReactTouchList = TouchEvent<HTMLDivElement>["touches"];

const INITIAL_TRANSFORM: ZoomTransform = {
  scale: MIN_SCALE,
  x: 0,
  y: 0,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getTouchDistance(touches: ReactTouchList) {
  const firstTouch = touches.item(0);
  const secondTouch = touches.item(1);

  if (!firstTouch || !secondTouch) return 0;

  return Math.hypot(
    firstTouch.clientX - secondTouch.clientX,
    firstTouch.clientY - secondTouch.clientY
  );
}

function getPanLimits(element: HTMLDivElement | null, scale: number) {
  if (!element || scale <= MIN_SCALE) {
    return { x: 0, y: 0 };
  }

  const rect = element.getBoundingClientRect();

  return {
    x: (rect.width * (scale - 1)) / 2,
    y: (rect.height * (scale - 1)) / 2,
  };
}

function clampTransform(
  transform: ZoomTransform,
  element: HTMLDivElement | null
): ZoomTransform {
  if (transform.scale <= MIN_SCALE) {
    return INITIAL_TRANSFORM;
  }

  const limits = getPanLimits(element, transform.scale);

  return {
    scale: transform.scale,
    x: clamp(transform.x, -limits.x, limits.x),
    y: clamp(transform.y, -limits.y, limits.y),
  };
}

export function useTouchImageZoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<GestureState>({ type: "none" });
  const tapStartRef = useRef<TapStart | null>(null);
  const lastTapTimeRef = useRef(0);
  const [transform, setTransform] =
    useState<ZoomTransform>(INITIAL_TRANSFORM);

  const resetZoom = useCallback(() => {
    setTransform(INITIAL_TRANSFORM);
    gestureRef.current = { type: "none" };
  }, []);

  const toggleDoubleTapZoom = useCallback(() => {
    setTransform((currentTransform) => {
      if (currentTransform.scale > MIN_SCALE) {
        return INITIAL_TRANSFORM;
      }

      return {
        scale: DOUBLE_TAP_SCALE,
        x: 0,
        y: 0,
      };
    });
  }, []);

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (event.touches.length === 2) {
        event.preventDefault();

        gestureRef.current = {
          type: "pinch",
          startDistance: getTouchDistance(event.touches),
          startScale: transform.scale,
        };
        tapStartRef.current = null;
        return;
      }

      const touch = event.touches.item(0);

      if (!touch) return;

      tapStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      if (transform.scale <= MIN_SCALE) {
        gestureRef.current = { type: "none" };
        return;
      }

      gestureRef.current = {
        type: "pan",
        startClientX: touch.clientX,
        startClientY: touch.clientY,
        startX: transform.x,
        startY: transform.y,
        moved: false,
      };
    },
    [transform]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;

      if (gesture.type === "pinch" && event.touches.length === 2) {
        event.preventDefault();
        event.stopPropagation();

        const nextDistance = getTouchDistance(event.touches);
        const nextScale = clamp(
          gesture.startScale * (nextDistance / gesture.startDistance),
          MIN_SCALE,
          MAX_SCALE
        );

        setTransform((currentTransform) =>
          clampTransform(
            {
              ...currentTransform,
              scale: nextScale,
            },
            containerRef.current
          )
        );
        return;
      }

      if (gesture.type !== "pan" || transform.scale <= MIN_SCALE) return;

      const touch = event.touches.item(0);

      if (!touch) return;

      event.preventDefault();
      event.stopPropagation();

      const nextX = gesture.startX + touch.clientX - gesture.startClientX;
      const nextY = gesture.startY + touch.clientY - gesture.startClientY;
      const moved =
        Math.abs(touch.clientX - gesture.startClientX) >
          TAP_DISTANCE_LIMIT ||
        Math.abs(touch.clientY - gesture.startClientY) >
          TAP_DISTANCE_LIMIT;

      gestureRef.current = {
        ...gesture,
        moved: gesture.moved || moved,
      };

      setTransform((currentTransform) =>
        clampTransform(
          {
            ...currentTransform,
            x: nextX,
            y: nextY,
          },
          containerRef.current
        )
      );
    },
    [transform.scale]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;

      if (gesture.type === "pinch") {
        if (event.touches.length < 2) {
          gestureRef.current = { type: "none" };
          setTransform((currentTransform) =>
            currentTransform.scale < 1.05
              ? INITIAL_TRANSFORM
              : clampTransform(currentTransform, containerRef.current)
          );
        }
        return;
      }

      if (gesture.type === "pan") {
        gestureRef.current = { type: "none" };
        if (gesture.moved) {
          tapStartRef.current = null;
          return;
        }
      }

      const tapStart = tapStartRef.current;
      const touch = event.changedTouches.item(0);

      if (!tapStart || !touch) return;

      const distance = Math.hypot(
        touch.clientX - tapStart.x,
        touch.clientY - tapStart.y
      );
      const duration = Date.now() - tapStart.time;
      const isTap =
        distance <= TAP_DISTANCE_LIMIT && duration <= DOUBLE_TAP_DELAY;

      tapStartRef.current = null;

      if (!isTap) return;

      const now = Date.now();
      const isDoubleTap = now - lastTapTimeRef.current <= DOUBLE_TAP_DELAY;

      if (!isDoubleTap) {
        lastTapTimeRef.current = now;
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      lastTapTimeRef.current = 0;
      toggleDoubleTapZoom();
    },
    [toggleDoubleTapZoom]
  );

  const imageStyle = useMemo<CSSProperties>(
    () => ({
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
      transition: "transform 160ms ease",
    }),
    [transform]
  );

  return {
    containerRef,
    imageStyle,
    isZoomed: transform.scale > MIN_SCALE,
    resetZoom,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: resetZoom,
    },
  };
}
