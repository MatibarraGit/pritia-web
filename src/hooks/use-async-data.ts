"use client";

import { useCallback, useSyncExternalStore } from "react";

type AsyncDataStatus = "idle" | "loading" | "success" | "error";

interface UseAsyncDataOptions<T> {
  cacheKey: string;
  fetchFunction: () => Promise<T | null | undefined>;
  initialData: T;
}

interface AsyncDataSnapshot<T> {
  data: T;
  error: unknown;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => Promise<T>;
}

interface AsyncDataEntry<T> {
  data: T;
  error: unknown;
  status: AsyncDataStatus;
  promise: Promise<T> | null;
  fetchFunction: () => Promise<T | null | undefined>;
  initialData: T;
  listeners: Set<() => void>;
  snapshot: AsyncDataSnapshot<T>;
}

const asyncDataCache = new Map<string, AsyncDataEntry<unknown>>();

function createSnapshot<T>(entry: AsyncDataEntry<T>): AsyncDataSnapshot<T> {
  return {
    data: entry.data,
    error: entry.error,
    isLoading: entry.status === "idle" || entry.status === "loading",
    isError: entry.status === "error",
    isSuccess: entry.status === "success",
    refetch: () => loadEntry(entry, true),
  };
}

function notifyEntry<T>(entry: AsyncDataEntry<T>) {
  entry.snapshot = createSnapshot(entry);
  entry.listeners.forEach((listener) => listener());
}

function loadEntry<T>(entry: AsyncDataEntry<T>, force = false): Promise<T> {
  if (entry.promise) return entry.promise;
  if (!force && entry.status === "success") return Promise.resolve(entry.data);

  entry.status = "loading";
  entry.error = null;
  notifyEntry(entry);

  entry.promise = entry.fetchFunction()
    .then((data) => {
      entry.data = data ?? entry.initialData;
      entry.status = "success";
      return entry.data;
    })
    .catch((error: unknown) => {
      entry.error = error;
      entry.status = "error";
      throw error;
    })
    .finally(() => {
      entry.promise = null;
      notifyEntry(entry);
    });

  return entry.promise;
}

function getEntry<T>({ cacheKey, fetchFunction, initialData }: UseAsyncDataOptions<T>): AsyncDataEntry<T> {
  const existingEntry = asyncDataCache.get(cacheKey) as AsyncDataEntry<T> | undefined;

  if (existingEntry) {
    existingEntry.fetchFunction = fetchFunction;
    existingEntry.initialData = initialData;
    return existingEntry;
  }

  const entry: AsyncDataEntry<T> = {
    data: initialData,
    error: null,
    status: "idle",
    promise: null,
    fetchFunction,
    initialData,
    listeners: new Set(),
    snapshot: {} as AsyncDataSnapshot<T>,
  };

  entry.snapshot = createSnapshot(entry);
  asyncDataCache.set(cacheKey, entry as AsyncDataEntry<unknown>);

  return entry;
}

export function useAsyncData<T>(options: UseAsyncDataOptions<T>): AsyncDataSnapshot<T> {
  const entry = getEntry(options);

  const subscribe = useCallback(
    (listener: () => void) => {
      entry.listeners.add(listener);

      if (entry.status === "idle") {
        void loadEntry(entry).catch(() => undefined);
      }

      return () => {
        entry.listeners.delete(listener);
      };
    },
    [entry]
  );

  return useSyncExternalStore(
    subscribe,
    () => entry.snapshot,
    () => entry.snapshot
  );
}
