"use client";

import { FormEvent, useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Search } from "lucide-react";
import { Button, Input } from "@/components/ui";

import { toastContext } from "@/contexts";
import { useSearch } from "@/hooks";
import { cn } from "@/libs/utils";

export const SearchComponent = () => {
  const router = useRouter();
  const [options, setOptions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { search, setSearch, error } = useSearch();
  const { showToast } = toastContext();

  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.length < 2) {
      setOptions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/autocomplete?search=${encodeURIComponent(value)}`);
      if (!response.ok) {
       console.error("Failed to fetch suggestions");
       return null;
      }
      const names: string[] = await response.json();
      setOptions(names);
      setShowSuggestions(names.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setOptions([]);
      setShowSuggestions(false);
    }
  }, []);

  const debouncedFetchSuggestions = useCallback((value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
  }, [fetchSuggestions]);

  const handleChange = (value: string) => {
    setSearch(value);
    setSelectedIndex(-1);
    debouncedFetchSuggestions(value);
  };

  const handleSubmit = ({ event, searchValue }: { event: FormEvent<HTMLFormElement> | null, searchValue?: string }) => {
    event?.preventDefault();
    const valueToSearch = searchValue || search;

    if (valueToSearch.trim() === '') {
      showToast('No se puede hacer una búsqueda vacía', 'error');
      return;
    } else if (error !== '') {
      showToast(error, 'error');
      return;
    }

    setShowSuggestions(false);
    router.push(`/search/${encodeURIComponent(valueToSearch)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    handleSubmit({ event: null, searchValue: suggestion });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || options.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(options[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={searchRef}
      className="
        w-[110%] h-14 flex absolute top-16 -left-[5%] bg-primary 
        md:w-full md:px-0 md:mx-4 md:relative md:top-0 md:left-0 md:bg-transparent
      "
    >
      <form
        onSubmit={(event) => handleSubmit({ event, searchValue: search })}
        className="relative w-11/12 mx-auto flex items-center md:w-full md:mx-0"
      >
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Encontrá lo que buscás..."
            className="w-full rounded-r-none border-r-0 bg-white focus-visible:ring-0 focus-visible:shadow-md md:border"
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (options.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
          
          {/* Sugerencias */}
          {showSuggestions && options.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(option)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors",
                    selectedIndex === index && "bg-gray-100"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="bg-black hover:bg-primary-light rounded-l-none flex md:bg-primary"
        >
          <Search className="h-5 w-5 text-white" />
        </Button>
      </form>
    </div>
  );
};
