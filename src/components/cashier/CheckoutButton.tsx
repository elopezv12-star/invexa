"use client";

import { useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import type { CartItem } from "@/brain/types";
import type { Suggestion } from "@/brain/types";

interface CheckoutButtonProps {
  cartItems: CartItem[];
  suggestions: (Suggestion & { accepted: boolean })[];
  onComplete: () => void;
  disabled?: boolean;
}

export function CheckoutButton({
  cartItems,
  suggestions,
  onComplete,
  disabled = false,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  // Calcular total con descuentos aplicados
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const totalDiscount = cartItems.reduce(
    (sum, item) =>
      sum +
      (Number(item.product.price) *
        item.quantity *
        (item.discount || 0)) /
        100,
    0
  );
  const total = subtotal - totalDiscount;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: Number(item.product.price),
            discount: item.discount || 0,
            hasWarranty: (item as any).hasWarranty || false,
          })),
          suggestions: suggestions.map((s) => ({
            ruleName: s.ruleName,
            message: s.message,
            accepted: s.accepted,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar venta");
      }

      onComplete();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error al procesar la venta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || cartItems.length === 0 || loading}
      className="w-full rounded-xl bg-brand-600 px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" />
          Cobrar — Q{total.toFixed(2)}
        </>
      )}
    </button>
  );
}
