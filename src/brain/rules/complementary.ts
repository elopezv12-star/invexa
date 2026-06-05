import type { Rule, Suggestion } from "../types";

/**
 * REGLA 3: Productos Complementarios (Tecnología)
 *
 * Basado en el último producto escaneado, sugiere agregar
 * un producto complementario. Relevante para tienda de tecnología:
 * - Laptop → ¿Base Enfriadora, Mousepad, Hub USB-C?
 * - Monitor → ¿Cable HDMI, Webcam?
 * - Teclado → ¿Mousepad, Mouse?
 * - Mouse → ¿Mousepad?
 * - Audífonos → ¿Parlante Bluetooth?
 * - Tablet → ¿Cargador, Audífonos?
 * - Impresora → ¿Cable HDMI, Cargador?
 * - Micrófono → ¿Parlante, Audífonos?
 * - SSD → ¿Cable SATA o Enclosure?
 * - Silla → ¿Lámpara LED Escritorio?
 */

// Mapa de productos complementarios (por nombre parcial)
const complementaryMap: Record<string, { name: string; message: string }[]> = {
  laptop: [
    { name: "Base Enfriadora", message: "💻 ¿Agregar una Base Enfriadora para tu laptop? Q199.00 — evitarás sobrecalentamiento." },
    { name: "Hub USB-C", message: "🔌 ¿Hub USB-C 7 en 1 para conectar todos tus dispositivos? Q249.00" },
    { name: "Mousepad XXL", message: "🖱️ ¿Mousepad XXL Escritorio para mayor comodidad? Q149.00" },
  ],
  monitor: [
    { name: "Cable HDMI", message: "🖥️ ¿Cable HDMI 2m para conectar tu monitor? Solo Q79.00" },
    { name: "Webcam HD", message: "📷 ¿Webcam HD 1080p para videollamadas? Q299.00 — ideal para home office." },
  ],
  teclado: [
    { name: "Mousepad XXL", message: "⌨️ ¿Mousepad XXL Escritorio para acompañar tu teclado mecánico? Q149.00" },
    { name: "Mouse Inalámbrico", message: "🖱️ ¿Mouse Inalámbrico Logitech para completar tu setup? Q199.00" },
  ],
  mouse: [
    { name: "Mousepad XXL", message: "🖱️ ¿Mousepad XXL Escritorio para mayor precisión? Q149.00" },
  ],
  audífonos: [
    { name: "Parlante Bluetooth", message: "🎵 ¿Parlante Bluetooth Portátil para disfrutar música sin audífonos? Q349.00" },
  ],
  auriculares: [
    { name: "Parlante Bluetooth", message: "🎵 ¿Parlante Bluetooth Portátil para compartir música? Q349.00" },
  ],
  tablet: [
    { name: "Audífonos Bluetooth", message: "📱 ¿Audífonos Bluetooth Sony para tu tablet? Q899.00 — sonido inalámbrico." },
  ],
  impresora: [
    { name: "Cable HDMI", message: "🖨️ ¿Cable HDMI 2m para conectar tu impresora? Solo Q79.00" },
  ],
  micrófono: [
    { name: "Parlante Bluetooth", message: "🎙️ ¿Parlante Bluetooth Portátil para monitorear tu audio? Q349.00" },
    { name: "Audífonos Bluetooth", message: "🎧 ¿Audífonos Bluetooth Sony para monitoreo en vivo? Q899.00" },
  ],
  ssd: [
    { name: "Disco Duro Externo", message: "💾 ¿Disco Duro Externo 1TB para respaldar tus datos? Q599.00 — almacenamiento extra." },
  ],
  silla: [
    { name: "Lámpara LED", message: "💡 ¿Lámpara LED Escritorio para tu estación de trabajo? Q189.00 — iluminación ajustable." },
  ],
  webcam: [
    { name: "Micrófono USB", message: "📷 ¿Micrófono USB Podcast para mejorar tu audio en videollamadas? Q449.00" },
  ],
  "memoria ram": [
    { name: "SSD Kingston", message: "⚡ ¿SSD Kingston 480GB para acelerar tu PC junto con la RAM? Q499.00" },
  ],
  cargador: [
    { name: "Hub USB-C", message: "🔌 ¿Hub USB-C 7 en 1 para aprovechar tu cargador? Q249.00" },
  ],
  "base enfriadora": [
    { name: "Hub USB-C", message: "❄️ ¿Hub USB-C 7 en 1 para conectar más dispositivos? Q249.00" },
  ],
};


export const complementaryProductsRule: Rule = {
  name: "complementary_products",
  description: "Producto escaneado → sugerir complemento natural",

  evaluate(context) {
    const product = context.lastScannedProduct;
    if (!product) return null;

    const productName = product.name.toLowerCase();

    // Buscar si el producto tiene complementos en el mapa
    for (const [key, complements] of Object.entries(complementaryMap)) {
      if (productName.includes(key)) {
        // Verificar que el complemento no esté ya en el carrito
        const complement = complements[0]; // Tomar el primero disponible
        const alreadyInCart = context.cart.some(
          (item) =>
            item.product.name.toLowerCase().includes(complement.name.toLowerCase())
        );

        if (!alreadyInCart) {
          const suggestion: Suggestion = {
            ruleName: this.name,
            message: complement.message,
            action: `suggest_complement_for_${product.id}`,
            suggestedProductName: complement.name,
          };
          return suggestion;

        }
      }
    }

    return null;
  },
};
