export const enum ACTION_TYPES {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  UPDATE_MANY = 'UPDATE_MANY',
  DELETE = 'DELETE',
  DISABLE = 'DISABLE',
  DISABLE_MANY = 'DISABLE_MANY',
  SHARE = 'SHARE'
};

// TODO: Poner false al finalizar HotSale
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