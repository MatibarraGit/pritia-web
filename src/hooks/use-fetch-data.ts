'use client'

import { useCallback, useEffect, useRef, useState } from "react"

export function useFetchData<T, P = unknown>({ 
  fetchFunction,
  initialFetch = true,
}: { 
  fetchFunction: (args?: P) => Promise<T | null> 
  initialFetch?: boolean
}) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchFunctionRef = useRef(fetchFunction);

  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  const fetchData = useCallback(async (args?: P) => {
    setIsLoading(true);
    try {
      const initialData = await fetchFunctionRef.current(args);
      setData(initialData);
    } catch {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialFetch) return;

    fetchData();
  }, [fetchData, initialFetch]);

  return { data, setData, isLoading, fetchData };
}