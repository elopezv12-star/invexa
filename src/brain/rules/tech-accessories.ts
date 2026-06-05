import type { Rule, Suggestion } from "../types";

/**
 * REGLA 6: Accesorios Imprescindibles para Tecnología
 *
 * Cuando se compran ciertos dispositivos, sugerir accesorios
 * esenciales que el cliente podría haber olvidado:
 * - Laptop → ¿Cargador Universal de repuesto?
 * - PC / Monitor → ¿SSD para mejorar rendimiento?
 * - Audífonos → ¿Cable auxiliar o adaptador?
 * - Tablet → ¿Funda o protector de pantalla?
 * - Cualquier dispositivo → ¿Cable HDMI o Hub USB-C?
 */
export const techAccessoriesRule: Rule = {
  name: "tech_accessories",
  description:
    "Dispositivo comprado → sugerir accesorios esenciales",

  evaluate(context) {
    // Mapa de accesorios esenciales por tipo de producto
    const accessoryMap: Record<string, { name: string; message: string }[]> = {
      laptop: [
        {
          name: "Cargador Laptop",
          message:
            "🔋 ¿Cargador Laptop Universal Q279.00? Nunca está de más tener un cargador de repuesto.",
        },
      ],
      tablet: [
        {
          name: "Audífonos Bluetooth",
          message:
            "🎧 ¿Audífonos Bluetooth Sony Q899.00? Perfectos para usar con tu tablet.",
        },
      ],
      monitor: [
        {
          name: "SSD Kingston",
          message:
            "⚡ ¿SSD Kingston 480GB Q499.00? Acelera el rendimiento de tu equipo.",
        },
      ],
      impresora: [
        {
          name: "Cable HDMI",
          message:
            "🔌 ¿Cable HDMI 2m Q79.00? Para conectar tu impresora a la PC.",
        },
      ],
      audífonos: [
        {
          name: "Hub USB-C",
          message:
            "🔌 ¿Hub USB-C 7 en 1 Q249.00? Para conectar tus audífonos y más dispositivos.",
        },
      ],
      parlante: [
        {
          name: "Cable HDMI",
          message:
            "🔊 ¿Cable HDMI 2m Q79.00? Conecta tu parlante a la TV o monitor.",
        },
      ],
    };

    const product = context.lastScannedProduct;
    if (!product) return null;

    const productName = product.name.toLowerCase();

    // Recorrer el mapa de accesorios
    for (const [key, accessories] of Object.entries(accessoryMap)) {
      if (productName.includes(key)) {
        const accessory = accessories[0];

        // Verificar que el accesorio no esté ya en el carrito
        const alreadyInCart = context.cart.some((item) =>
          item.product.name.toLowerCase().includes(accessory.name.toLowerCase())
        );

        if (!alreadyInCart) {
          const suggestion: Suggestion = {
            ruleName: this.name,
            message: accessory.message,
            action: `suggest_accessory_for_${product.id}`,
            suggestedProductName: accessory.name,
          };
          return suggestion;

        }
      }
    }

    return null;
  },
};
