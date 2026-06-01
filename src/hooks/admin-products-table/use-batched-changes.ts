"use client";

import { useCallback, useRef, useState } from "react";

export interface ProductChange<TField extends string = string> {
  productId: number;
  field: TField;
  value: unknown;
  previousValue: unknown;
}

export type BatchedChanges<TField extends string = string> = Record<
  number,
  Record<TField, { value: unknown; previousValue: unknown }>
>;

interface UseBatchedChangesOptions<TField extends string = string> {
  onFlush?: (changes: BatchedChanges<TField>) => Promise<void> | void;
}

export function useBatchedChanges<TField extends string = string>({
  onFlush,
}: UseBatchedChangesOptions<TField> = {}) {
  const [pendingChanges, setPendingChanges] = useState<BatchedChanges<TField>>({});
  const [isFlushing, setIsFlushing] = useState(false);
  const changesRef = useRef<BatchedChanges<TField>>({});

  const flushChanges = useCallback(async () => {
    const changesToFlush = { ...changesRef.current };
    if (Object.keys(changesToFlush).length === 0) return;

    setIsFlushing(true);

    try {
      await onFlush?.(changesToFlush);
      changesRef.current = {};
      setPendingChanges({});
    } finally {
      setIsFlushing(false);
    }
  }, [onFlush]);

  const trackChange = useCallback(
    ({ productId, field, value, previousValue }: ProductChange<TField>) => {
      // Esta línea hace que si cambia el originalPrice, cambie el price real en la bbdd, ya que después el descuento se calcula en el código en base al price real de la bbdd
      const fieldProp = field === "originalPrice" ? "price" : field;

      changesRef.current = {
        ...changesRef.current,
        [productId]: {
          ...changesRef.current[productId],
          [fieldProp]: { value, previousValue },
        },
      };

      setPendingChanges({ ...changesRef.current });
    },
    []
  );

  const discardChanges = useCallback((productId?: number) => {
    if (productId) {
      delete changesRef.current[productId];
    } else {
      changesRef.current = {};
    }

    setPendingChanges({ ...changesRef.current });
  }, []);

  const flushNow = useCallback(async () => {
    await flushChanges();
  }, [flushChanges]);

  const pendingChangeCount = Object.values(pendingChanges).reduce(
    (acc, fields) => acc + Object.keys(fields).length,
    0
  );

  return {
    pendingChanges,
    hasPendingChanges: Object.keys(pendingChanges).length > 0,
    pendingChangeCount,
    isFlushing,
    trackChange,
    discardChanges,
    flushNow,
  };
}
