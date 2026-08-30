import type { ColumnConfig } from "@/types";

export const enum ACTION_TYPES {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SHARE = 'SHARE'
};

export const COLUMNS: ColumnConfig[] = [
  { key: "inStock", label: "Stock", type: "boolean", width: "minmax(120px, 0.7fr)" },
  { key: "images", label: "Imagen", type: "image", width: "minmax(120px, 0.8fr)" },
  { key: "name", label: "Nombre", type: "text", width: "minmax(240px, 2fr)" },
  { key: "description", label: "Descripción", type: "textarea", width: "minmax(280px, 320px)" },
  { key: "providers", label: "Proveedores", type: "multiselect", width: "minmax(220px, 320px)" },
  { key: "purchasePrice", label: "P/Compra", type: "currency", width: "minmax(130px, 0.8fr)" },
  { key: "price", label: "P/Venta", type: "currency", width: "minmax(130px, 0.8fr)" },
  { key: "resellersPrice", label: "P/Revendedores", type: "currency", width: "minmax(150px, 0.9fr)" },
  { key: "discountPercent", label: "Descuento", type: "percentage", width: "minmax(120px, 0.7fr)" },
  { key: "createdAt", label: "Creación", type: "datetime", width: "minmax(170px, 1fr)" },
  { key: "updatedAt", label: "Actualizado", type: "datetime", width: "minmax(170px, 1fr)" },
  { key: "stock", label: "Inventario", type: "number", width: "minmax(120px, 0.7fr)" },
  { key: "category", label: "Categoría", type: "select", width: "minmax(190px, 1fr)" },
  { key: "subcategory", label: "Subcategoría", type: "select", width: "minmax(220px, 1.2fr)" },
];

export const CONTACT_METHODS = Object.freeze({
  WHATSAPP: '+54 9 11 3173-8925',
  WHATSAPP_URL: 'https://wa.me/+5491131738925',
  // FACEBOOK_URL: 'https://www.facebook.com/pritia',
  INSTAGRAM_URL: 'https://www.instagram.com/_pritia_',
  EMAIL: 'matileonardo.2013@gmail.com',
  EMAIL_URL: 'mailto:matileonardo.2013@gmail.com',
})

export const EVENTS = {
  IS_HOT_SALE: false
} as const;

export const FINANCING_CONFIG = Object.freeze({
  interestFreeInstallments: 3,
  listPriceInterest: 1.2382, // Porcentaje adicional en precio de lista para "3 cuotas sin interés"
  featuredInstallments: [1, 3, 6, 12],
  defaultCardInstallments: 3,
  displayCardMethods: [
    {
      id: "visa",
      name: "Visa",
      icon: "/icons/visa.svg"
    },
    {
      id: "master",
      name: "Mastercard",
      icon: "/icons/mastercard.svg"
    }, 
    {
      id: "naranja",
      name: "Naranja X",
      icon: "/icons/naranjax.svg"
    },
    {
      id: "amex",
      name: "American Express",
      icon: "/icons/amex.svg"
    },
    {
      id: "cabal",
      name: "Cabal",
      icon: "/icons/cabal.gif"
    },
  ],
  defaultIssuerId: "316" // issuer.id del banco BBVA
});

export const enum PURCHASE_ORDER_STATUS {
  UNCONFIRMED = 'Sin confirmar',
  PURCHASE_PENDING = 'Pendiente de compra',
  READY_TO_SHIP = 'Lista para enviar',
  DELIVERED = 'Entregada',
  CANCELLED = 'Cancelada'
};

export const REVIEW_WAIT_DAYS = 3;

export const enum PAYMENT_METHODS {
  UNSPECIFIED = 'No especificado',
  CASH = 'Efectivo',
  TRANSFER = 'Transferencia',
  DEBIT_CARD = 'Tarjeta de débito',
  CREDIT_CARD = 'Tarjeta de crédito',
}

export const enum PAYMENT_STATUS {
  PENDING = 'Pendiente',
  PARTIAL_PAID = 'Pago parcial',
  FULL_PAID = 'Pago completo',
}

export const PRODUCTS_PER_PAGE = 60;
export const OUTDATED_PRODUCTS_DAYS = 30;

export const enum TOPICS {
  HIGHLIGHTS = 'destacados',
  NEW_ENTRIES = 'nuevos ingresos',
  OFFERS = 'ofertas',
  BEST_SELLERS = 'más vendidos',
  RE_ENTRIES = 'reingresos',
  NEWS = 'novedades'
}

export const ONE_DAY = 3600 * 24;

export const ORDER_PARAMETERS = {
  "Relevancia": 'createdAt',
  "Precio": 'price',
} as const;

export const ACCENT_CATEGORIES = {
  "tecnologia-y-gaming": 'Tecnología y gaming',
  "electronica-audio-y-video": 'Electrónica, audio y video',
  "electrodomesticos": "Electrodomésticos",
  "pequenos-electrodomesticos": "Pequeños electrodomésticos",
  "climatizacion": "Climatización",
  "hogar-y-jardin": "Hogar y jardín",
  "blanqueria": "Blanquería",
  "bebes-y-accesorios": "Bebés y accesorios"
} as const;

export const ACCENT_SUBCATEGORIES = {
  "consolas-y-tv-boxs": "Consolas y TV Box's",
  "perifericos-y-sillas-gamer": 'Periféricos y sillas gamer',
  "cocina-y-preparacion-de-alimentos": "Cocina y preparación de alimentos",
  "ollas-sartenes-y-bateria-de-cocina": "Ollas, sartenes y baterías de cocina",
  "termos-botellas-y-vasos-termicos": "Termos, botellas y vasos térmicos",
  "equipo-medico-para-el-hogar": "Equipo médico para el hogar",
  "griferia": "Grifería",
  "organizacion-del-hogar": "Organización del hogar",
  "limpieza-y-lavanderia": "Limpieza y lavandería",
  "herramientas-electricas": "Herramientas eléctricas",
  "jardin-y-mantenimiento-exterior": "Jardín y mantenimiento exterior",
  "sabanas-mantas-y-almohadas": "Sábanas, mantas y almohadas",
  "lactancia-y-alimentacion": "Lactancia y alimentación",
  "cuidado-personal-y-cosmeticos": "Cuidado personal y cosméticos",
  "jardin-y-aire-libre": "Jardín y aire libre",
  "almacenamiento-y-organizacion": "Almacenamiento y organización",
  "juguetes-electronicos": "Juguetes electrónicos",
} as const;
