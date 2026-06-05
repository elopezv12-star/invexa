"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { Product } from "@/database/schema";
import type { CartItem, Suggestion } from "@/brain/types";
import { evaluateCart } from "@/brain/engine";
import { ProductScanner } from "@/components/cashier/ProductScanner";
import { Cart } from "@/components/cashier/Cart";
import { SuggestionPanel } from "@/components/cashier/SuggestionPanel";
import { CheckoutButton } from "@/components/cashier/CheckoutButton";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function CashierPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [suggestions, setSuggestions] = useState<
    (Suggestion & { accepted: boolean })[]
  >([]);
  const [lastScannedProduct, setLastScannedProduct] = useState<
    Product | undefined
  >();
  const [saleCount, setSaleCount] = useState(0);

  /** Agregar producto al carrito y disparar el motor de reglas */
  const handleProductAdd = useCallback(
    (product: Product) => {
      setLastScannedProduct(product);

      setCartItems((prev) => {
        const existing = prev.find(
          (item) => item.product.id === product.id
        );
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { product, quantity: 1 }];
      });

      // Evaluar reglas después de actualizar el carrito
      // Usamos setTimeout para asegurar que el estado se actualice
      setTimeout(() => {
        setCartItems((currentCart) => {
          const newSuggestions = evaluateCart({
            cart: currentCart,
            lastScannedProduct: product,
          });

          // Mezclar con sugerencias existentes (evitar duplicados)
          setSuggestions((prev) => {
            const merged = [...prev];
            for (const s of newSuggestions) {
              if (!merged.find((m) => m.ruleName === s.ruleName)) {
                merged.push({ ...s, accepted: false });
              }
            }
            return merged;
          });

          return currentCart;
        });
      }, 0);
    },
    []
  );

  /** Aceptar una sugerencia */
  const handleAcceptSuggestion = useCallback(
    (suggestion: Suggestion) => {
      setSuggestions((prev) =>
        prev.map((s) =>
          s.ruleName === suggestion.ruleName ? { ...s, accepted: true } : s
        )
      );

      const ruleName = suggestion.ruleName;

      // Aplicar la acción según la regla
      if (suggestion.suggestedProductName) {
        // REGLAS: complementary_products y tech_accessories → agregar producto al carrito
        const productName = suggestion.suggestedProductName;
        fetch(`/api/products?q=${encodeURIComponent(productName)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.products && data.products.length > 0) {
              const found = data.products.find(
                (p: Product) =>
                  p.name.toLowerCase().includes(productName.toLowerCase()) ||
                  productName.toLowerCase().includes(p.name.toLowerCase())
              );
              if (found) {
                setCartItems((prev) => {
                  const existing = prev.find(
                    (item) => item.product.id === found.id
                  );
                  if (existing) {
                    return prev.map((item) =>
                      item.product.id === found.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    );
                  }
                  return [...prev, { product: found, quantity: 1 }];
                });
              }
            }
          })
          .catch((err) =>
            console.error("Error buscando producto sugerido:", err)
          );

      } else if (ruleName === "bulk_discount") {
        // REGLA: Descuento por volumen → aplicar descuento a ítems duplicados
        setCartItems((prev) => {
          const counts: Record<number, number> = {};
          prev.forEach((item) => {
            const id = item.product.id;
            if (item.quantity >= 2) {
              counts[id] = item.quantity;
            }
          });

          const discountValue = 8; // 8% de descuento por volumen
          return prev.map((item) => {
            if (counts[item.product.id] && item.quantity >= 2) {
              return {
                ...item,
                discount: discountValue,
              };
            }
            return item;
          });
        });

      } else if (ruleName === "total_discount") {
        // REGLA: Descuento por total → aplicar descuento a todos los items
        const total = cartItems.reduce(
          (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
          0
        );

        let discountPercent = 0;
        if (total >= 5000) discountPercent = 8;
        else if (total >= 1500) discountPercent = 5;
        else if (total >= 500) discountPercent = 3;

        if (discountPercent > 0) {
          setCartItems((prev) =>
            prev.map((item) => ({
              ...item,
              discount: Math.max(item.discount || 0, discountPercent),
            }))
          );
        }

      } else if (ruleName === "fragile_handling") {

        // REGLA: Empaque frágil → marcar como empaque especial (sin descuento, solo aviso)
        // La sugerencia ya se aceptó visualmente, no hay cambios en el carrito

      } else if (ruleName === "extended_warranty") {
        // REGLA: Garantía extendida → marcar items caros con garantía
        setCartItems((prev) =>
          prev.map((item) => {
            const price = parseFloat(item.product.price);
            if (price >= 1000) {
              return {
                ...item,
                // Guardamos la garantía como metadata (no es descuento, es un recargo)
                discount: item.discount || 0,
                hasWarranty: true,
              };
            }
            return item;
          })
        );
      }
    },
    [cartItems]
  );



  /** Ignorar/descartar una sugerencia */
  const handleDismissSuggestion = useCallback(
    (suggestion: Suggestion) => {
      setSuggestions((prev) =>
        prev.filter((s) => s.ruleName !== suggestion.ruleName)
      );
    },
    []
  );

  /** Actualizar cantidad de un producto en el carrito */
  const handleUpdateQuantity = useCallback(
    (productId: number, delta: number) => {
      setCartItems((prev) => {
        const updated = prev
          .map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(0, item.quantity + delta) }
              : item
          )
          .filter((item) => item.quantity > 0);

        // Reevaluar reglas
        setTimeout(() => {
          const newSuggestions = evaluateCart({
            cart: updated,
            lastScannedProduct,
          });

          setSuggestions((prev) => {
            const merged = [...prev];
            for (const s of newSuggestions) {
              if (!merged.find((m) => m.ruleName === s.ruleName)) {
                merged.push({ ...s, accepted: false });
              }
            }
            // Quitar sugerencias que ya no aplican
            return merged.filter((m) =>
              newSuggestions.some((ns) => ns.ruleName === m.ruleName)
            );
          });
        }, 0);

        return updated;
      });
    },
    [lastScannedProduct]
  );

  /** Eliminar un producto del carrito */
  const handleRemoveItem = useCallback(
    (productId: number) => {
      setCartItems((prev) => {
        const updated = prev.filter((item) => item.product.id !== productId);

        setTimeout(() => {
          const newSuggestions = evaluateCart({
            cart: updated,
            lastScannedProduct,
          });
          setSuggestions((prev) =>
            prev.filter((m) =>
              newSuggestions.some((ns) => ns.ruleName === m.ruleName)
            )
          );
        }, 0);

        return updated;
      });
    },
    [lastScannedProduct]
  );

  /** Nueva venta completada */
  const handleSaleComplete = useCallback(() => {
    setCartItems([]);
    setSuggestions([]);
    setLastScannedProduct(undefined);
    setSaleCount((prev) => prev + 1);
  }, []);

  /** Limpiar todo */
  const handleNewSale = useCallback(() => {
    setCartItems([]);
    setSuggestions([]);
    setLastScannedProduct(undefined);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Barra superior */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-brand-900">Invexa POS</h1>
            <p className="text-xs text-gray-500">
              Ventas hoy: {saleCount} transacción(es)
            </p>
          </div>
        </div>
        <button
          onClick={handleNewSale}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Nueva Venta
        </button>
      </header>

      {/* Cuerpo principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Columna izquierda: Scanner + Carrito */}
        <div className="flex-1 flex flex-col p-6 gap-4 overflow-hidden">
          {/* Scanner */}
          <ProductScanner onProductAdd={handleProductAdd} />

          {/* Carrito */}
          <div className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm overflow-hidden">
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          {/* Botón de checkout */}
          <CheckoutButton
            cartItems={cartItems}
            suggestions={suggestions}
            onComplete={handleSaleComplete}
          />
        </div>

        {/* Columna derecha: Panel de sugerencias */}
        <div className="w-80 border-l border-gray-100 bg-white p-4 overflow-y-auto custom-scrollbar">
          <SuggestionPanel
            suggestions={suggestions}
            onAccept={handleAcceptSuggestion}
            onDismiss={handleDismissSuggestion}
          />
        </div>
      </div>
    </div>
  );
}
