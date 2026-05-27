import type { ColumnConfig } from "@/types";

export const enum ACTION_TYPES {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SHARE = 'SHARE'
};

export const COLUMNS: ColumnConfig[] = [
  { key: "inStock", label: "Stock", type: "boolean", editable: true, width: "minmax(120px, 0.7fr)" },
  { key: "images", label: "Imagen", type: "image", editable: false, width: "minmax(120px, 0.8fr)" },
  { key: "name", label: "Nombre", type: "text", editable: true, width: "minmax(240px, 2fr)" },
  { key: "description", label: "Descripción", type: "textarea", editable: true, width: "minmax(280px, 320px)" },
  { key: "providers", label: "Proveedores", type: "multiselect", editable: true, width: "minmax(220px, 320px)" },
  { key: "purchasePrice", label: "P/Compra", type: "currency", editable: true, width: "minmax(130px, 0.8fr)" },
  { key: "price", label: "P/Venta", type: "currency", editable: true, width: "minmax(130px, 0.8fr)" },
  { key: "resellersPrice", label: "P/Revendedores", type: "currency", editable: true, width: "minmax(150px, 0.9fr)" },
  { key: "discountPercent", label: "Descuento", type: "percentage", editable: true, width: "minmax(120px, 0.7fr)" },
  { key: "createdAt", label: "Creación", type: "datetime", editable: true, width: "minmax(170px, 1fr)" },
  { key: "updatedAt", label: "Actualizado", type: "datetime", editable: true, width: "minmax(170px, 1fr)" },
  { key: "stock", label: "Inventario", type: "number", editable: true, width: "minmax(120px, 0.7fr)" },
  { key: "category", label: "Categoría", type: "select", editable: true, width: "minmax(190px, 1fr)" },
  { key: "subcategory", label: "Subcategoría", type: "select", editable: true, width: "minmax(220px, 1.2fr)" },
];

export const EVENTS = {
  IS_HOT_SALE: false
} as const;

export const enum PURCHASE_ORDER_STATUS {
  UNCONFIRMED = 'Sin confirmar',
  PURCHASE_PENDING = 'Pendiente de compra',
  READY_TO_SHIP = 'Lista para enviar',
  SOLD ='Vendida'
};

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

export const enum TOPICS {
  NEW_ENTRIES = 'nuevos ingresos',
  OFFERS = 'ofertas',
  BEST_SELLERS = 'más vendidos',
  RE_ENTRIES = 'reingresos',
  NEWS = 'novedades'
}

export const TO_OPTIONS = Object.freeze([
  {
    name: 'Número secundario',
    number: 5491130069853,
    type: 'seller'
  },
  {
    name: 'Morty',
    number: 5491155256122,
    type: 'seller'
  },
  {
    name: 'Adri',
    number: 5491130806126,
    type: 'seller'
  },
  {
    name: 'Jana',
    number: 5491131134516,
    type: 'reseller'
  }
] as const);

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