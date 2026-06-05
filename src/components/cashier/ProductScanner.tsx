"use client";

import { useState, useRef, useEffect } from "react";
import type { Product } from "@/database/schema";

interface ProductScannerProps {
  onProductAdd: (product: Product) => void;
}

export function ProductScanner({ onProductAdd }: ProductScannerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data.products || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  const handleSelect = (product: Product) => {
    onProductAdd(product);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0]);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Escanear / Buscar Producto
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="🔍 Código o nombre del producto..."
          className="w-full rounded-xl border-2 border-brand-200 bg-white px-4 py-3.5 text-base text-brand-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all"
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {results.map((product) => (
            <button
              key={product.id}
              onMouseDown={() => handleSelect(product)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-brand-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div>
                <span className="font-medium text-gray-900">{product.name}</span>
                {product.fragile && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    🥚 Frágil
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-brand-600">
                Q{Number(product.price).toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl p-4 text-center text-sm text-gray-500">
          No se encontraron productos para "{query}"
        </div>
      )}
    </div>
  );
}
